import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = process.env.FFMPEG_BIN || "ffmpeg";
const ffprobe = process.env.FFPROBE_BIN || "ffprobe";
const configPath = resolve(root, process.env.BGM_RECIPES || "assets/audio/bgm-production.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const [command = "help", subject, ...rawOptions] = process.argv.slice(2);
const options = parseOptions(rawOptions);

if (command === "help" || command === "--help" || command === "-h") {
  printHelp();
} else if (command === "list") {
  listRecipes();
} else if (command === "validate") {
  validateConfig();
} else if (command === "plan") {
  requireSubject(subject, command);
  console.log(JSON.stringify(resolveRecipe(subject), null, 2));
} else if (command === "inspect") {
  requireSubject(subject, command);
  assertTools();
  const target = resolveSubject(subject);
  console.log(JSON.stringify(inspectAudio(target.path), null, 2));
} else if (command === "build") {
  requireSubject(subject, command);
  assertTools();
  buildRecipe(subject, options);
} else if (command === "verify") {
  requireSubject(subject, command);
  assertTools();
  verifySubject(subject, options);
} else {
  fail(`Unknown command: ${command}. Run \"npm run audio:bgm -- help\" for usage.`);
}

function printHelp() {
  console.log(`BGM production pipeline

Usage:
  npm run audio:bgm -- list
  npm run audio:bgm -- validate
  npm run audio:bgm -- plan <recipe-id>
  npm run audio:bgm -- inspect <recipe-id|audio-path>
  npm run audio:bgm -- build <recipe-id> [--output <path>] [--report <path>] [--force]
  npm run audio:bgm -- verify <recipe-id|audio-path> [--report <path>]

Environment:
  FFMPEG_BIN     ffmpeg executable or absolute path
  FFPROBE_BIN    ffprobe executable or absolute path
  BGM_RECIPES    recipe JSON path relative to the repository root

The build command never edits its source. Recipes should point raw generations at
assets/audio/unchanged and candidate renders at assets/audio/review.`);
}

function listRecipes() {
  for (const [id, recipe] of Object.entries(config.recipes ?? {})) {
    const merged = mergeRecipe(id, recipe);
    console.log(`${id}\t${merged.status ?? "unknown"}\t${merged.cueId ?? "-"}\t${merged.output}`);
  }
}

function validateConfig() {
  const ids = Object.keys(config.recipes ?? {});
  if (!ids.length) fail("BGM recipe config must contain at least one recipe");
  for (const id of ids) {
    const recipe = resolveRecipe(id);
    if (isAbsolute(recipe.input) || isAbsolute(recipe.output) || (recipe.report && isAbsolute(recipe.report))) {
      fail(`${id}: committed recipe paths must be relative to the repository`);
    }
    if (recipe.inputPath === recipe.outputPath) fail(`${id}: output must not overwrite its source`);
    if (recipe.status === "candidate" && !recipe.output.replaceAll("\\", "/").startsWith("assets/audio/review/")) {
      fail(`${id}: candidate output must live under assets/audio/review/`);
    }
    if (recipe.status === "approved" && !recipe.output.replaceAll("\\", "/").startsWith("assets/audio/bgm/")) {
      fail(`${id}: approved output must live under assets/audio/bgm/`);
    }
    if (extname(recipe.output).toLowerCase() !== ".ogg") fail(`${id}: output must use the .ogg container`);
    if (recipe.report && extname(recipe.report).toLowerCase() !== ".json") fail(`${id}: report must be JSON`);
  }
  console.log(`BGM recipe validation passed: ${ids.length} recipe${ids.length === 1 ? "" : "s"}.`);
}

function parseOptions(args) {
  const parsed = { force: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--force") {
      parsed.force = true;
      continue;
    }
    if (["--output", "--report"].includes(arg)) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) fail(`${arg} requires a path`);
      parsed[arg.slice(2)] = value;
      index += 1;
      continue;
    }
    fail(`Unknown option: ${arg}`);
  }
  return parsed;
}

function resolveSubject(subject) {
  if (config.recipes?.[subject]) {
    const recipe = resolveRecipe(subject);
    return { path: recipe.outputPath, recipe };
  }
  return { path: projectPath(subject), recipe: null };
}

function resolveRecipe(id) {
  const raw = config.recipes?.[id];
  if (!raw) fail(`Unknown BGM recipe: ${id}`);
  const recipe = mergeRecipe(id, raw);
  recipe.inputPath = projectPath(recipe.input);
  recipe.outputPath = projectPath(recipe.output);
  recipe.reportPath = recipe.report ? projectPath(recipe.report) : null;
  validateRecipe(recipe);
  return recipe;
}

function mergeRecipe(id, recipe) {
  return { id, ...(config.defaults ?? {}), ...recipe };
}

function validateRecipe(recipe) {
  for (const field of ["input", "output", "startSeconds", "durationSeconds", "crossfadeSeconds"]) {
    if (recipe[field] === undefined || recipe[field] === null || recipe[field] === "") {
      fail(`${recipe.id}: ${field} is required`);
    }
  }
  for (const field of ["startSeconds", "durationSeconds", "crossfadeSeconds", "sampleRate", "channels", "targetLufs", "truePeakDb", "loudnessRange"]) {
    if (!Number.isFinite(Number(recipe[field]))) fail(`${recipe.id}: ${field} must be numeric`);
  }
  if (recipe.startSeconds < 0) fail(`${recipe.id}: startSeconds cannot be negative`);
  if (recipe.durationSeconds <= 0) fail(`${recipe.id}: durationSeconds must be positive`);
  if (recipe.crossfadeSeconds < 0 || recipe.crossfadeSeconds >= recipe.durationSeconds) {
    fail(`${recipe.id}: crossfadeSeconds must be at least 0 and shorter than durationSeconds`);
  }
  if (![1, 2].includes(Number(recipe.channels))) fail(`${recipe.id}: channels must be 1 or 2`);
  if (!["libopus", "libvorbis"].includes(recipe.codec)) fail(`${recipe.id}: codec must be libopus or libvorbis`);
}

function buildRecipe(id, cliOptions) {
  const recipe = resolveRecipe(id);
  const outputPath = cliOptions.output ? projectPath(cliOptions.output) : recipe.outputPath;
  const reportPath = cliOptions.report
    ? projectPath(cliOptions.report)
    : cliOptions.output
      ? null
      : recipe.reportPath;
  if (!existsSync(recipe.inputPath)) fail(`${id}: source is missing: ${displayPath(recipe.inputPath)}`);
  if (existsSync(outputPath) && !cliOptions.force) {
    fail(`${displayPath(outputPath)} already exists; pass --force to replace it`);
  }

  const sourceProbe = probeAudio(recipe.inputPath);
  const requiredEnd = recipe.startSeconds + recipe.durationSeconds + recipe.crossfadeSeconds;
  if (sourceProbe.durationSeconds + 0.01 < requiredEnd) {
    fail(`${id}: source ends at ${sourceProbe.durationSeconds.toFixed(3)}s, but this loop needs ${requiredEnd.toFixed(3)}s`);
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  const scratchDir = mkdtempSync(join(dirname(outputPath), `.bgm-${safeName(id)}-`));
  const shapedPath = join(scratchDir, "01-shaped.wav");
  const encodedPath = join(scratchDir, `02-master${extname(outputPath) || ".ogg"}`);

  try {
    renderLoopSource(recipe, shapedPath);
    const measured = measureLoudness(shapedPath);
    encodeMaster(recipe, shapedPath, encodedPath, measured);
    const report = makeReport(recipe, encodedPath, sourceProbe, measured);
    if (!report.validation.passed) {
      fail(`${id}: rendered master failed validation:\n${report.validation.errors.map((error) => `- ${error}`).join("\n")}`);
    }
    if (existsSync(outputPath)) rmSync(outputPath, { force: true });
    renameSync(encodedPath, outputPath);
    report.output = displayPath(outputPath);
    report.result.path = displayPath(outputPath);
    if (reportPath) writeReport(reportPath, report);
    console.log(JSON.stringify(report, null, 2));
    console.log(`BGM ${recipe.status === "approved" ? "runtime master" : "candidate"} ready: ${displayPath(outputPath)}`);
  } finally {
    rmSync(scratchDir, { recursive: true, force: true });
  }
}

function renderLoopSource(recipe, outputPath) {
  const start = Number(recipe.startSeconds);
  const duration = Number(recipe.durationSeconds);
  const fade = Number(recipe.crossfadeSeconds);
  const format = `aresample=${recipe.sampleRate},aformat=sample_fmts=fltp:channel_layouts=${recipe.channels === 1 ? "mono" : "stereo"}`;
  let graph;

  if (fade > 0) {
    const headEnd = start + fade;
    const bodyEnd = start + duration;
    const tailEnd = bodyEnd + fade;
    graph = [
      `[0:a]${format}${toneFilters(recipe)},asplit=3[source-head][source-body][source-tail]`,
      `[source-head]atrim=start=${start}:end=${headEnd},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=${fade}:curve=tri[head]`,
      `[source-body]atrim=start=${headEnd}:end=${bodyEnd},asetpts=PTS-STARTPTS[body]`,
      `[source-tail]atrim=start=${bodyEnd}:end=${tailEnd},asetpts=PTS-STARTPTS,afade=t=out:st=0:d=${fade}:curve=tri[tail]`,
      "[tail][head]amix=inputs=2:duration=longest:normalize=0,asetpts=PTS-STARTPTS[seam]",
      "[body][seam]concat=n=2:v=0:a=1[out]"
    ].join(";");
  } else {
    graph = `[0:a]${format}${toneFilters(recipe)},atrim=start=${start}:duration=${duration},asetpts=PTS-STARTPTS[out]`;
  }

  run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", recipe.inputPath,
    "-filter_complex", graph,
    "-map", "[out]",
    "-ar", String(recipe.sampleRate),
    "-ac", String(recipe.channels),
    "-c:a", "pcm_s24le",
    outputPath
  ], "render loop source");
}

function toneFilters(recipe) {
  const filters = [];
  if (Number(recipe.highpassHz) > 0) filters.push(`highpass=f=${Number(recipe.highpassHz)}`);
  if (Number(recipe.lowpassHz) > 0) filters.push(`lowpass=f=${Number(recipe.lowpassHz)}`);
  return filters.length ? `,${filters.join(",")}` : "";
}

function encodeMaster(recipe, inputPath, outputPath, measured) {
  const normalization = [
    `loudnorm=I=${recipe.targetLufs}`,
    `TP=${recipe.truePeakDb}`,
    `LRA=${recipe.loudnessRange}`,
    `measured_I=${measured.integratedLufs}`,
    `measured_LRA=${measured.loudnessRangeLu}`,
    `measured_TP=${measured.truePeakDb}`,
    `measured_thresh=${measured.thresholdDb}`,
    `offset=${measured.targetOffsetDb}`,
    "linear=true",
    "print_format=summary"
  ].join(":");
  const codecArgs = recipe.codec === "libopus"
    ? ["-c:a", "libopus", "-b:a", recipe.bitrate, "-vbr", "on", "-compression_level", "10"]
    : ["-c:a", "libvorbis", "-q:a", String(recipe.quality ?? 6)];

  run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", inputPath,
    "-af", normalization,
    "-ar", String(recipe.sampleRate),
    "-ac", String(recipe.channels),
    ...codecArgs,
    "-metadata", `title=${recipe.title ?? recipe.id}`,
    "-metadata", `comment=Built by process-bgm recipe ${recipe.id}`,
    outputPath
  ], "normalize and encode master");
}

function verifySubject(subject, cliOptions) {
  const target = resolveSubject(subject);
  if (!existsSync(target.path)) fail(`Audio file is missing: ${displayPath(target.path)}`);
  const report = target.recipe
    ? makeReport(target.recipe, target.path, existsSync(target.recipe.inputPath) ? probeAudio(target.recipe.inputPath) : null, null)
    : { inspectedAt: new Date().toISOString(), ...inspectAudio(target.path) };
  if (cliOptions.report) writeReport(projectPath(cliOptions.report), report);
  console.log(JSON.stringify(report, null, 2));
  if (report.validation && !report.validation.passed) process.exitCode = 1;
}

function makeReport(recipe, outputPath, sourceProbe, normalizationInput) {
  const output = inspectAudio(outputPath);
  const validation = validateMaster(recipe, output);
  return {
    recipeId: recipe.id,
    cueId: recipe.cueId ?? null,
    status: recipe.status ?? null,
    builtAt: new Date().toISOString(),
    source: displayPath(recipe.inputPath),
    output: displayPath(outputPath),
    edit: {
      startSeconds: recipe.startSeconds,
      outputDurationSeconds: recipe.durationSeconds,
      circularCrossfadeSeconds: recipe.crossfadeSeconds,
      sourceEndSeconds: recipe.startSeconds + recipe.durationSeconds + recipe.crossfadeSeconds
    },
    processing: {
      sampleRate: recipe.sampleRate,
      channels: recipe.channels,
      lowpassHz: recipe.lowpassHz ?? null,
      highpassHz: recipe.highpassHz ?? null,
      targetLufs: recipe.targetLufs,
      truePeakDb: recipe.truePeakDb,
      codec: recipe.codec,
      bitrate: recipe.bitrate ?? null
    },
    sourceProbe,
    normalizationInput,
    result: output,
    validation
  };
}

function inspectAudio(path) {
  if (!existsSync(path)) fail(`Audio file is missing: ${displayPath(path)}`);
  return {
    path: displayPath(path),
    probe: probeAudio(path),
    loudness: measureLoudness(path),
    seam: measureSeam(path)
  };
}

function probeAudio(path) {
  const result = runCapture(ffprobe, [
    "-v", "error",
    "-select_streams", "a:0",
    "-show_entries", "stream=codec_name,sample_rate,channels:format=duration,size,format_name",
    "-of", "json",
    path
  ], "probe audio");
  const data = JSON.parse(result.stdout);
  const stream = data.streams?.[0];
  if (!stream) fail(`No audio stream found in ${displayPath(path)}`);
  return {
    codec: stream.codec_name,
    sampleRate: Number(stream.sample_rate),
    channels: Number(stream.channels),
    durationSeconds: Number(data.format.duration),
    bytes: Number(data.format.size),
    container: data.format.format_name
  };
}

function measureLoudness(path) {
  const result = runCapture(ffmpeg, [
    "-hide_banner", "-nostats", "-i", path,
    "-af", "loudnorm=I=-20:TP=-1:LRA=11:print_format=json",
    "-f", "null", "-"
  ], "measure loudness", { allowStderr: true });
  const blocks = result.stderr.match(/\{[\s\S]*?"target_offset"\s*:\s*"[^"]+"[\s\S]*?\}/g);
  if (!blocks?.length) fail(`Could not parse loudness report for ${displayPath(path)}`);
  const data = JSON.parse(blocks.at(-1));
  const output = {
    integratedLufs: numeric(data.input_i, "input_i"),
    truePeakDb: numeric(data.input_tp, "input_tp"),
    loudnessRangeLu: numeric(data.input_lra, "input_lra"),
    thresholdDb: numeric(data.input_thresh, "input_thresh"),
    targetOffsetDb: numeric(data.target_offset, "target_offset")
  };
  return output;
}

function measureSeam(path) {
  const probe = probeAudio(path);
  const channels = 2;
  const sampleRate = 48000;
  const result = spawnSync(ffmpeg, [
    "-hide_banner", "-loglevel", "error",
    "-i", path,
    "-ar", String(sampleRate),
    "-ac", String(channels),
    "-f", "f32le", "-acodec", "pcm_f32le", "pipe:1"
  ], { encoding: null, maxBuffer: 256 * 1024 * 1024 });
  if (result.status !== 0) fail(`decode seam samples failed: ${result.stderr?.toString() ?? result.error?.message ?? "unknown error"}`);
  const samples = new Float32Array(result.stdout.buffer, result.stdout.byteOffset, result.stdout.byteLength / 4);
  if (samples.length < channels * 2) fail(`Not enough decoded samples in ${displayPath(path)}`);
  let jump = 0;
  let deltaSquared = 0;
  let deltaCount = 0;
  for (let channel = 0; channel < channels; channel += 1) {
    jump = Math.max(jump, Math.abs(samples[channel] - samples[samples.length - channels + channel]));
    for (let index = channel + channels; index < samples.length; index += channels) {
      const delta = samples[index] - samples[index - channels];
      deltaSquared += delta * delta;
      deltaCount += 1;
    }
  }
  const sampleDeltaRms = Math.sqrt(deltaSquared / Math.max(1, deltaCount));
  const edgeFrames = Math.min(Math.floor(0.5 * sampleRate), Math.floor(samples.length / channels / 2));
  const firstRms = interleavedRms(samples, 0, edgeFrames, channels);
  const lastRms = interleavedRms(samples, samples.length / channels - edgeFrames, edgeFrames, channels);
  return {
    endpointJumpDbfs: amplitudeDb(jump),
    ordinarySampleDeltaRmsDbfs: amplitudeDb(sampleDeltaRms),
    endpointJumpAboveOrdinaryDeltaDb: amplitudeDb(jump) - amplitudeDb(sampleDeltaRms),
    firstHalfSecondRmsDbfs: amplitudeDb(firstRms),
    lastHalfSecondRmsDbfs: amplitudeDb(lastRms),
    edgeRmsDeltaDb: Math.abs(amplitudeDb(firstRms) - amplitudeDb(lastRms)),
    decodedDurationSeconds: samples.length / channels / sampleRate,
    probedDurationSeconds: probe.durationSeconds
  };
}

function validateMaster(recipe, inspected) {
  const errors = [];
  const expectedCodec = recipe.codec === "libopus" ? "opus" : "vorbis";
  if (inspected.probe.codec !== expectedCodec) errors.push(`codec is ${inspected.probe.codec}, expected ${expectedCodec}`);
  if (inspected.probe.sampleRate !== Number(recipe.sampleRate)) errors.push(`sample rate is ${inspected.probe.sampleRate}, expected ${recipe.sampleRate}`);
  if (inspected.probe.channels !== Number(recipe.channels)) errors.push(`channels is ${inspected.probe.channels}, expected ${recipe.channels}`);
  if (Math.abs(inspected.probe.durationSeconds - recipe.durationSeconds) > 0.2) {
    errors.push(`duration is ${inspected.probe.durationSeconds.toFixed(3)}s, expected ${recipe.durationSeconds}s ±0.2s`);
  }
  if (Math.abs(inspected.loudness.integratedLufs - recipe.targetLufs) > 0.6) {
    errors.push(`loudness is ${inspected.loudness.integratedLufs.toFixed(1)} LUFS, expected ${recipe.targetLufs} ±0.6`);
  }
  if (inspected.loudness.truePeakDb > recipe.truePeakDb + 0.15) {
    errors.push(`true peak is ${inspected.loudness.truePeakDb.toFixed(1)} dBTP, must not exceed ${recipe.truePeakDb}`);
  }
  if (inspected.seam.edgeRmsDeltaDb > Number(recipe.maxEdgeRmsDeltaDb ?? 4)) {
    errors.push(`loop edge RMS differs by ${inspected.seam.edgeRmsDeltaDb.toFixed(1)} dB`);
  }
  if (inspected.seam.endpointJumpAboveOrdinaryDeltaDb > Number(recipe.maxEndpointJumpAboveDeltaDb ?? 18)) {
    errors.push(`loop endpoint jump is ${inspected.seam.endpointJumpAboveOrdinaryDeltaDb.toFixed(1)} dB above the track's ordinary sample delta`);
  }
  return { passed: errors.length === 0, errors };
}

function interleavedRms(samples, startFrame, frameCount, channels) {
  let sum = 0;
  let count = 0;
  const start = Math.floor(startFrame) * channels;
  const end = Math.min(samples.length, start + frameCount * channels);
  for (let index = start; index < end; index += 1) {
    sum += samples[index] * samples[index];
    count += 1;
  }
  return Math.sqrt(sum / Math.max(1, count));
}

function amplitudeDb(value) {
  if (value <= 0) return -120;
  return 20 * Math.log10(value);
}

function numeric(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) fail(`Invalid loudness value ${label}=${value}`);
  return number;
}

function writeReport(path, report) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`BGM report ready: ${displayPath(path)}`);
}

function assertTools() {
  runCapture(ffmpeg, ["-version"], "ffmpeg");
  runCapture(ffprobe, ["-version"], "ffprobe");
}

function run(commandName, args, label) {
  const result = spawnSync(commandName, args, { stdio: "inherit" });
  if (result.status !== 0) fail(`${label} failed (${result.status ?? result.error?.message ?? "unknown error"})`);
}

function runCapture(commandName, args, label, { allowStderr = false } = {}) {
  const result = spawnSync(commandName, args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (result.status !== 0) fail(`${label} failed: ${result.stderr || result.error?.message || "unknown error"}`);
  if (!allowStderr && result.error) fail(`${label} failed: ${result.error.message}`);
  return result;
}

function projectPath(path) {
  return isAbsolute(path) ? resolve(path) : resolve(root, path);
}

function displayPath(path) {
  const local = relative(root, path);
  return local && !local.startsWith("..") && !isAbsolute(local) ? local : path;
}

function safeName(value) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-");
}

function requireSubject(subject, commandName) {
  if (!subject) fail(`${commandName} requires a recipe id or audio path`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
