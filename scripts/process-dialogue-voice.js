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
import { dirname, extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = process.env.FFMPEG_BIN || "ffmpeg";
const ffprobe = process.env.FFPROBE_BIN || "ffprobe";
const configPath = projectPath(process.env.AMPHION_VOICE_MANIFEST || "assets/audio/voice/amphion-production.json");
const recordingPath = projectPath("assets/audio/voice/recording-manifest.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const recording = JSON.parse(readFileSync(recordingPath, "utf8"));
const [command = "help", subject, ...rawOptions] = process.argv.slice(2);
const options = parseOptions(rawOptions);

if (["help", "--help", "-h"].includes(command)) {
  printHelp();
} else if (command === "list") {
  validateConfig({ quiet: true });
  listJobs();
} else if (command === "validate") {
  validateConfig();
} else if (command === "plan") {
  requireCue(subject, command);
  validateConfig({ quiet: true });
  console.log(JSON.stringify(makePlan(subject), null, 2));
} else if (command === "prepare") {
  validateConfig({ quiet: true, allowReferenceRewrite: options.force });
  prepareReferences(subject ?? "all", options);
} else if (command === "inspect") {
  requireCue(subject, command);
  assertTools();
  const input = options.input ? projectPath(options.input) : resolveJob(subject).reviewPathResolved;
  console.log(JSON.stringify(inspectAudio(input), null, 2));
} else if (command === "stage") {
  requireCue(subject, command);
  if (!options.input) fail("stage requires --input <generated-wav>");
  validateConfig({ quiet: true });
  assertTools();
  stageCandidate(subject, options);
} else {
  fail(`Unknown command: ${command}. Run "npm run audio:voice -- help" for usage.`);
}

function printHelp() {
  console.log(`Dialogue voice candidate pipeline

Usage:
  npm run audio:voice -- list
  npm run audio:voice -- validate
  npm run audio:voice -- plan <cue-id>
  npm run audio:voice -- prepare [all|speaker-profile-id|cue-id] [--dry-run] [--force]
  npm run audio:voice -- inspect <cue-id> [--input <audio-path>]
  npm run audio:voice -- stage <cue-id> --input <generated-wav> [--output <review.ogg>] [--report <report.json>] [--force]

The pipeline only creates ignored internal-review candidates. It deliberately has
no command that promotes a non-commercial checkpoint output into a runtime master.
Use AMPHION_VOICE_MANIFEST, FFMPEG_BIN, or FFPROBE_BIN to override local paths.`);
}

function listJobs() {
  for (const raw of config.jobs ?? []) {
    const job = resolveJob(raw.cueId);
    const reference = referenceState(job);
    console.log(`${job.cueId}\t${job.engine}\t${job.status}\t${reference}\t${job.speakerProfileId}`);
  }
}

function validateConfig({ quiet = false, allowReferenceRewrite = false } = {}) {
  const errors = [];
  const jobs = config.jobs ?? [];
  const recordingEntries = new Map((recording.entries ?? []).map((entry) => [entry.cueId, entry]));
  const seen = new Set();
  const profileReferencePaths = new Map();

  if (config.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (config.policy?.commercialReleaseAllowed !== false) errors.push("policy.commercialReleaseAllowed must stay false for the listed official checkpoints");
  if (config.policy?.referenceConsentRequired !== true) errors.push("voice-reference consent must be required");
  if (!jobs.length) errors.push("at least one voice job is required");

  const codeRevision = config.upstream?.code?.revision;
  if (!isPinnedRevision(codeRevision)) errors.push("upstream code revision must be a pinned 40-character Git SHA");
  for (const [engineId, engine] of Object.entries(config.upstream?.engines ?? {})) {
    if (!isPinnedRevision(engine.revision)) errors.push(`${engineId}: model revision must be a pinned 40-character Git SHA`);
    if (engine.commercialReleaseAllowed !== false) errors.push(`${engineId}: official checkpoint must remain marked non-commercial`);
    if (!String(engine.license ?? "").includes("NC")) errors.push(`${engineId}: expected a non-commercial checkpoint license marker`);
  }

  for (const raw of jobs) {
    const cueId = raw.cueId || "<missing-cue>";
    if (seen.has(cueId)) errors.push(`${cueId}: duplicate Amphion job`);
    seen.add(cueId);
    const record = recordingEntries.get(cueId);
    if (!record) errors.push(`${cueId}: missing recording-manifest entry`);
    if (record && raw.transcript !== record.transcript) errors.push(`${cueId}: transcript differs from recording-manifest`);
    if (record && raw.targetPath !== record.targetPath) errors.push(`${cueId}: targetPath differs from recording-manifest`);
    const profile = config.speakerProfiles?.[raw.speakerProfileId];
    if (!profile) errors.push(`${cueId}: unknown speakerProfileId ${raw.speakerProfileId}`);
    if (profile && !profile.referenceScript?.trim()) errors.push(`${cueId}: speaker profile requires a referenceScript`);
    if (profile?.referenceScript?.trim() === raw.transcript?.trim()) errors.push(`${cueId}: referenceScript must not repeat the target line`);
    const referenceScriptLength = Array.from(profile?.referenceScript?.trim() ?? "").length;
    if (profile && (referenceScriptLength < 25 || referenceScriptLength > 90)) errors.push(`${cueId}: referenceScript must be 25–90 characters for an 8–20 second recording`);
    const engineId = raw.engine ?? config.defaults?.engine;
    if (!config.upstream?.engines?.[engineId]) errors.push(`${cueId}: unknown engine ${engineId}`);
    if (raw.status !== "blocked-reference" && raw.status !== "ready-for-generation" && raw.status !== "candidate-generated") {
      errors.push(`${cueId}: unsupported internal status ${raw.status}`);
    }
    for (const field of ["referenceWav", "referenceTranscript", "generationDirectory", "reviewPath", "reportPath"]) {
      if (!raw[field]) {
        errors.push(`${cueId}: ${field} is required`);
        continue;
      }
      if (isAbsolute(raw[field])) errors.push(`${cueId}: ${field} must be repository-relative`);
      if (!isInsideRoot(projectPath(raw[field]))) errors.push(`${cueId}: ${field} escapes the repository`);
    }
    if (!normalized(raw.referenceWav).startsWith(`${normalized(config.paths?.referenceRoot)}/`)) errors.push(`${cueId}: referenceWav must live under referenceRoot`);
    if (extname(raw.referenceWav).toLowerCase() !== ".wav") errors.push(`${cueId}: referenceWav must use uncompressed .wav`);
    if (!normalized(raw.referenceTranscript).startsWith(`${normalized(config.paths?.referenceRoot)}/`)) errors.push(`${cueId}: referenceTranscript must live under referenceRoot`);
    if (!normalized(raw.generationDirectory).startsWith(`${normalized(config.paths?.generationRoot)}/`)) errors.push(`${cueId}: generationDirectory must live under generationRoot`);
    if (!normalized(raw.reviewPath).startsWith(`${normalized(config.paths?.reviewRoot)}/`)) errors.push(`${cueId}: candidate output must live under ignored reviewRoot`);
    if (!normalized(raw.reportPath).startsWith(`${normalized(config.paths?.reportRoot)}/`)) errors.push(`${cueId}: report must live under ignored reportRoot`);
    if (extname(raw.reviewPath).toLowerCase() !== ".ogg") errors.push(`${cueId}: reviewPath must use .ogg`);
    if (extname(raw.reportPath).toLowerCase() !== ".json") errors.push(`${cueId}: reportPath must use .json`);
    if (projectPath(raw.reviewPath) === projectPath(String(raw.targetPath).replace(/^\.\//, ""))) errors.push(`${cueId}: review candidate must not overwrite the runtime master`);
    const previousReferencePath = profileReferencePaths.get(raw.speakerProfileId);
    if (previousReferencePath && previousReferencePath !== raw.referenceTranscript) errors.push(`${cueId}: jobs sharing a speaker profile must share one referenceTranscript`);
    profileReferencePaths.set(raw.speakerProfileId, raw.referenceTranscript);
    if (profile?.referenceScript?.trim() && existsSync(projectPath(raw.referenceTranscript))) {
      const existing = readFileSync(projectPath(raw.referenceTranscript), "utf8").trim();
      if (existing !== profile.referenceScript.trim() && !allowReferenceRewrite) errors.push(`${cueId}: reference transcript differs from the committed recording script`);
    }
  }

  for (const cueId of recordingEntries.keys()) {
    if (!seen.has(cueId)) errors.push(`${cueId}: missing Amphion evaluation job`);
  }
  if (errors.length) fail(`Voice manifest validation failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join("\n")}`);

  if (!quiet) {
    const blocked = jobs.filter((job) => referenceState(resolveJob(job.cueId)) !== "reference-ready").length;
    console.log(`Voice manifest validation passed: ${jobs.length} jobs; ${blocked} awaiting consented reference audio/text.`);
  }
}

function prepareReferences(selector, cliOptions) {
  const jobs = config.jobs ?? [];
  let profileIds;
  if (selector === "all") {
    profileIds = [...new Set(jobs.map((job) => job.speakerProfileId))];
  } else if (config.speakerProfiles?.[selector]) {
    profileIds = [selector];
  } else {
    const job = jobs.find((item) => item.cueId === selector);
    if (!job) fail(`Unknown speaker profile or voice cue: ${selector}`);
    profileIds = [job.speakerProfileId];
  }

  const actions = profileIds.map((profileId) => {
    const profile = config.speakerProfiles[profileId];
    const paths = [...new Set(jobs
      .filter((job) => job.speakerProfileId === profileId)
      .map((job) => job.referenceTranscript))];
    if (paths.length !== 1) fail(`${profileId}: expected exactly one shared reference transcript path`);
    const path = projectPath(paths[0]);
    const text = `${profile.referenceScript.trim()}\n`;
    const existing = existsSync(path) ? readFileSync(path, "utf8") : null;
    if (existing !== null && existing.trim() !== profile.referenceScript.trim() && !cliOptions.force) {
      fail(`${displayPath(path)} already contains different text; pass --force only after updating the recording plan`);
    }
    return {
      profileId,
      path,
      text,
      action: existing === text ? "unchanged" : existing === null ? "create" : "replace"
    };
  });

  if (!cliOptions.dryRun) {
    for (const action of actions) {
      if (action.action === "unchanged") continue;
      mkdirSync(dirname(action.path), { recursive: true });
      writeFileSync(action.path, action.text);
    }
  }
  console.log(JSON.stringify({
    dryRun: cliOptions.dryRun,
    references: actions.map((action) => ({
      speakerProfileId: action.profileId,
      transcript: displayPath(action.path),
      wav: displayPath(resolve(dirname(action.path), "reference.wav")),
      action: cliOptions.dryRun ? `would-${action.action}` : action.action
    }))
  }, null, 2));
}

function makePlan(cueId) {
  const job = resolveJob(cueId);
  const engine = config.upstream.engines[job.engine];
  return {
    cueId: job.cueId,
    policy: config.policy.purpose,
    commercialReleaseAllowed: false,
    engine: {
      id: job.engine,
      modelRepository: engine.modelRepository,
      revision: engine.revision,
      license: engine.license
    },
    speakerProfile: config.speakerProfiles[job.speakerProfileId],
    transcript: job.transcript,
    performance: job.performance,
    reference: {
      state: referenceState(job),
      wav: displayPath(job.referenceWavResolved),
      transcript: displayPath(job.referenceTranscriptResolved)
    },
    generation: {
      outputDirectory: displayPath(job.generationDirectoryResolved),
      takes: job.takes,
      seeds: Array.from({ length: job.takes }, (_, index) => job.seedBase + index),
      command: [
        "python3", "scripts/amphion-generate-voice.py",
        "--cue", job.cueId,
        "--amphion-root", "/absolute/path/to/pinned/Amphion"
      ]
    },
    review: {
      candidate: displayPath(job.reviewPathResolved),
      report: displayPath(job.reportPathResolved),
      stageCommand: [
        "npm", "run", "audio:voice", "--", "stage", job.cueId,
        "--input", `${displayPath(job.generationDirectoryResolved)}/take-${job.seedBase}.wav`
      ],
      targetLufs: job.targetLufs,
      truePeakDb: job.truePeakDb,
      effectsDeferred: job.effectsDeferred ?? []
    },
    runtimeMaster: {
      path: job.targetPath,
      mayBeOverwrittenByThisPipeline: false
    }
  };
}

function stageCandidate(cueId, cliOptions) {
  const job = resolveJob(cueId);
  const inputPath = projectPath(cliOptions.input);
  const outputPath = cliOptions.output ? projectPath(cliOptions.output) : job.reviewPathResolved;
  const reportPath = cliOptions.report ? projectPath(cliOptions.report) : job.reportPathResolved;
  assertReviewDestination(outputPath, "candidate output", config.paths.reviewRoot, ".ogg");
  assertReviewDestination(reportPath, "candidate report", config.paths.reportRoot, ".json");
  if (!existsSync(inputPath)) fail(`Generated take is missing: ${displayPath(inputPath)}`);
  if (existsSync(outputPath) && !cliOptions.force) fail(`${displayPath(outputPath)} already exists; pass --force to replace it`);

  const input = inspectAudio(inputPath);
  if (input.probe.durationSeconds < 0.25 || input.probe.durationSeconds > 45) {
    fail(`${cueId}: generated speech duration ${input.probe.durationSeconds.toFixed(2)}s is outside the 0.25–45s review range`);
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  const scratch = mkdtempSync(resolve(dirname(outputPath), `.voice-${safeName(cueId)}-`));
  const shaped = resolve(scratch, "01-shaped.wav");
  const encoded = resolve(scratch, "02-candidate.ogg");
  try {
    shapeCandidate(job, inputPath, shaped);
    const measured = measureLoudness(shaped);
    encodeCandidate(job, shaped, encoded, measured);
    const output = inspectAudio(encoded);
    const validation = validateCandidate(job, output);
    if (!validation.passed) fail(`${cueId}: candidate failed validation:\n${validation.errors.map((error) => `- ${error}`).join("\n")}`);
    if (existsSync(outputPath)) rmSync(outputPath, { force: true });
    renameSync(encoded, outputPath);
    const report = {
      cueId,
      status: config.policy.candidateStatus,
      commercialReleaseAllowed: false,
      generatedAt: new Date().toISOString(),
      input: { path: displayPath(inputPath), ...input },
      processing: {
        sampleRate: job.sampleRate,
        channels: job.channels,
        targetLufs: job.targetLufs,
        truePeakDb: job.truePeakDb,
        headSilenceSeconds: job.headSilenceSeconds,
        tailSilenceSeconds: job.tailSilenceSeconds,
        effectsDeferred: job.effectsDeferred ?? []
      },
      output: { path: displayPath(outputPath), ...output },
      validation,
      runtimeMasterUntouched: job.targetPath
    };
    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    console.log(`Internal voice candidate ready: ${displayPath(outputPath)}`);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

function shapeCandidate(job, inputPath, outputPath) {
  const delayMs = Math.max(0, Math.round(Number(job.headSilenceSeconds) * 1000));
  const tail = Math.max(0, Number(job.tailSilenceSeconds));
  const filters = [
    `aresample=${job.sampleRate}`,
    `aformat=sample_fmts=fltp:channel_layouts=${Number(job.channels) === 1 ? "mono" : "stereo"}`,
    ...(delayMs ? [`adelay=${delayMs}:all=1`] : []),
    ...(tail ? [`apad=pad_dur=${tail}`] : [])
  ];
  run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", inputPath,
    "-af", filters.join(","),
    "-ar", String(job.sampleRate),
    "-ac", String(job.channels),
    "-c:a", "pcm_s24le",
    outputPath
  ], "shape voice candidate");
}

function encodeCandidate(job, inputPath, outputPath, measured) {
  const normalization = [
    `loudnorm=I=${job.targetLufs}`,
    `TP=${job.truePeakDb}`,
    "LRA=7",
    `measured_I=${measured.integratedLufs}`,
    `measured_LRA=${measured.loudnessRangeLu}`,
    `measured_TP=${measured.truePeakDb}`,
    `measured_thresh=${measured.thresholdDb}`,
    `offset=${measured.targetOffsetDb}`,
    "linear=true",
    "print_format=summary"
  ].join(":");
  run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", inputPath,
    "-af", normalization,
    "-ar", String(job.sampleRate),
    "-ac", String(job.channels),
    "-c:a", "libvorbis", "-q:a", String(job.quality),
    "-metadata", `title=${job.cueId} internal review candidate`,
    "-metadata", "comment=Non-commercial Amphion evaluation candidate; not a runtime master",
    outputPath
  ], "normalize and encode voice candidate");
}

function inspectAudio(path) {
  if (!existsSync(path)) fail(`Audio file is missing: ${displayPath(path)}`);
  return { probe: probeAudio(path), loudness: measureLoudness(path) };
}

function probeAudio(path) {
  const result = runCapture(ffprobe, [
    "-v", "error", "-select_streams", "a:0",
    "-show_entries", "stream=codec_name,sample_rate,channels:format=duration,size,format_name",
    "-of", "json", path
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
    "-af", "loudnorm=I=-18:TP=-3:LRA=7:print_format=json",
    "-f", "null", "-"
  ], "measure loudness", { allowStderr: true });
  const blocks = result.stderr.match(/\{[\s\S]*?"target_offset"\s*:\s*"[^"]+"[\s\S]*?\}/g);
  if (!blocks?.length) fail(`Could not parse loudness report for ${displayPath(path)}`);
  const data = JSON.parse(blocks.at(-1));
  return {
    integratedLufs: numeric(data.input_i, "input_i"),
    truePeakDb: numeric(data.input_tp, "input_tp"),
    loudnessRangeLu: numeric(data.input_lra, "input_lra"),
    thresholdDb: numeric(data.input_thresh, "input_thresh"),
    targetOffsetDb: numeric(data.target_offset, "target_offset")
  };
}

function validateCandidate(job, inspected) {
  const errors = [];
  if (inspected.probe.codec !== "vorbis") errors.push(`codec is ${inspected.probe.codec}, expected vorbis`);
  if (inspected.probe.sampleRate !== Number(job.sampleRate)) errors.push(`sample rate is ${inspected.probe.sampleRate}, expected ${job.sampleRate}`);
  if (inspected.probe.channels !== Number(job.channels)) errors.push(`channels is ${inspected.probe.channels}, expected ${job.channels}`);
  if (Math.abs(inspected.loudness.integratedLufs - Number(job.targetLufs)) > 0.8) errors.push(`loudness is ${inspected.loudness.integratedLufs.toFixed(1)} LUFS, expected ${job.targetLufs} ±0.8`);
  if (inspected.loudness.truePeakDb > Number(job.truePeakDb) + 0.2) errors.push(`true peak is ${inspected.loudness.truePeakDb.toFixed(1)} dBTP, must not exceed ${job.truePeakDb}`);
  return { passed: errors.length === 0, errors };
}

function resolveJob(cueId) {
  const raw = (config.jobs ?? []).find((job) => job.cueId === cueId);
  if (!raw) fail(`Unknown voice cue: ${cueId}`);
  const job = { ...(config.defaults ?? {}), ...raw };
  job.engine = raw.engine ?? config.defaults.engine;
  for (const field of ["referenceWav", "referenceTranscript", "generationDirectory", "reviewPath", "reportPath"]) {
    job[`${field}Resolved`] = projectPath(job[field]);
  }
  return job;
}

function referenceState(job) {
  if (!existsSync(job.referenceWavResolved) && !existsSync(job.referenceTranscriptResolved)) return "missing-wav-and-text";
  if (!existsSync(job.referenceWavResolved)) return "missing-wav";
  if (!existsSync(job.referenceTranscriptResolved)) return "missing-text";
  if (!readFileSync(job.referenceTranscriptResolved, "utf8").trim()) return "empty-text";
  const profile = config.speakerProfiles?.[job.speakerProfileId];
  if (profile?.referenceScript?.trim() !== readFileSync(job.referenceTranscriptResolved, "utf8").trim()) return "text-does-not-match-script";
  return "reference-ready";
}

function assertReviewDestination(path, label, rootPath, extension) {
  const allowedRoot = projectPath(rootPath);
  if (!isInside(path, allowedRoot)) fail(`${label} must live under ${displayPath(allowedRoot)}/`);
  if (extname(path).toLowerCase() !== extension) fail(`${label} must use ${extension}`);
}

function parseOptions(args) {
  const parsed = { force: false, dryRun: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--force") {
      parsed.force = true;
      continue;
    }
    if (arg === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }
    if (["--input", "--output", "--report"].includes(arg)) {
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

function isInside(path, parent) {
  const local = relative(parent, path);
  return local !== "" && !local.startsWith("..") && !isAbsolute(local);
}

function isInsideRoot(path) {
  return path === root || isInside(path, root);
}

function normalized(path) {
  return String(path ?? "").replaceAll("\\", "/").replace(/\/$/, "");
}

function isPinnedRevision(value) {
  return /^[0-9a-f]{40}$/i.test(String(value ?? ""));
}

function numeric(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) fail(`Invalid loudness value ${label}=${value}`);
  return number;
}

function safeName(value) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-");
}

function requireCue(cueId, commandName) {
  if (!cueId) fail(`${commandName} requires a cue id`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
