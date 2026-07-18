import { mkdirSync, rmSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = process.env.FFMPEG_BIN || "ffmpeg";
const say = process.env.SAY_BIN || "say";
const scratchDir = resolve(root, ".tmp-audio-p1");

assertCommand(ffmpeg, ["-version"], "ffmpeg with libvorbis");
assertCommand(say, ["-v", "?"], "macOS say");

mkdirSync(resolve(root, "assets", "audio", "bgm"), { recursive: true });
mkdirSync(resolve(root, "assets", "audio", "ambience"), { recursive: true });
mkdirSync(resolve(root, "assets", "audio", "voice"), { recursive: true });
mkdirSync(scratchDir, { recursive: true });

const loops = [
  {
    file: "bgm/title-nightshift.ogg",
    title: "Night Shift title bed",
    inputs: [
      "sine=frequency=55:sample_rate=48000:duration=20",
      "sine=frequency=82.407:sample_rate=48000:duration=20",
      "sine=frequency=110:sample_rate=48000:duration=20",
      "anoisesrc=color=brown:sample_rate=48000:duration=20:amplitude=0.04"
    ],
    filter: "[0:a]volume=0.12,tremolo=f=0.10:d=0.18[a0];[1:a]volume=0.065,tremolo=f=0.10:d=0.12[a1];[2:a]volume=0.025,tremolo=f=0.20:d=0.22[a2];[3:a]lowpass=f=900,highpass=f=70,volume=0.026[n];[a0][a1][a2][n]amix=inputs=4:normalize=0,volume=2.7,alimiter=limit=0.55[out]"
  },
  {
    file: "bgm/pressure-stem.ogg",
    title: "Live pressure stem",
    inputs: [
      "sine=frequency=48:sample_rate=48000:duration=16",
      "sine=frequency=96:sample_rate=48000:duration=16",
      "sine=frequency=192:sample_rate=48000:duration=16",
      "anoisesrc=color=pink:sample_rate=48000:duration=16:amplitude=0.05"
    ],
    filter: "[0:a]volume=0.16,tremolo=f=1.5:d=0.78[a0];[1:a]volume=0.06,tremolo=f=3:d=0.64[a1];[2:a]volume=0.018,tremolo=f=6:d=0.72[a2];[3:a]highpass=f=150,lowpass=f=2600,tremolo=f=1.5:d=0.55,volume=0.025[n];[a0][a1][a2][n]amix=inputs=4:normalize=0,volume=3.1,alimiter=limit=0.52[out]"
  },
  {
    file: "ambience/studio-room.ogg",
    title: "Late-night studio room tone",
    inputs: [
      "anoisesrc=color=pink:sample_rate=48000:duration=24:amplitude=0.055",
      "anoisesrc=color=brown:sample_rate=48000:duration=24:amplitude=0.035",
      "sine=frequency=50:sample_rate=48000:duration=24"
    ],
    filter: "[0:a]highpass=f=170,lowpass=f=5400,volume=0.034[p];[1:a]highpass=f=45,lowpass=f=430,volume=0.026[b];[2:a]volume=0.010,tremolo=f=0.25:d=0.16[h];[p][b][h]amix=inputs=3:normalize=0,volume=7.5,alimiter=limit=0.42[out]"
  },
  {
    file: "ambience/city-afternoon.ogg",
    title: "Muted city afternoon",
    inputs: [
      "anoisesrc=color=pink:sample_rate=48000:duration=24:amplitude=0.065",
      "anoisesrc=color=brown:sample_rate=48000:duration=24:amplitude=0.045",
      "sine=frequency=185:sample_rate=48000:duration=24",
      "sine=frequency=740:sample_rate=48000:duration=24"
    ],
    filter: "[0:a]highpass=f=220,lowpass=f=3900,tremolo=f=0.13:d=0.22,volume=0.032[p];[1:a]highpass=f=55,lowpass=f=520,tremolo=f=0.10:d=0.38,volume=0.032[b];[2:a]volume=0.006,tremolo=f=0.18:d=0.82[c];[3:a]volume=0.0025,tremolo=f=0.10:d=0.92[d];[p][b][c][d]amix=inputs=4:normalize=0,volume=6.8,alimiter=limit=0.42[out]"
  }
];

for (const asset of loops) buildLoop(asset);
buildDryerPlayback();
rmSync(scratchDir, { recursive: true, force: true });

function buildLoop(asset) {
  const args = ["-hide_banner", "-loglevel", "error", "-y"];
  asset.inputs.forEach((input) => args.push("-f", "lavfi", "-i", input));
  args.push(
    "-filter_complex", asset.filter,
    "-map", "[out]",
    "-ar", "48000",
    "-ac", "2",
    "-c:a", "libvorbis",
    "-q:a", "5",
    "-metadata", `title=${asset.title}`,
    "-metadata", "artist=Livestream Detective P1 audio pass",
    resolve(root, "assets", "audio", asset.file)
  );
  run(ffmpeg, args, asset.file);
}

function buildDryerPlayback() {
  const speechPath = resolve(scratchDir, "dryer-speech.aiff");
  run(say, [
    "-v", "Tingting",
    "-r", "205",
    "-o", speechPath,
    "今晚又被店长说了……只有你能接住我。"
  ], "voice source");
  if (statSync(speechPath).size < 8192) {
    throw new Error("macOS speech service returned an empty voice source; rerun audio:p1 with speech-service access");
  }
  run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", speechPath,
    "-f", "lavfi", "-i", "anoisesrc=color=pink:sample_rate=48000:duration=8:amplitude=0.18",
    "-f", "lavfi", "-i", "anoisesrc=color=white:sample_rate=48000:duration=8:amplitude=0.08",
    "-filter_complex",
    "[0:a]highpass=f=170,lowpass=f=3900,acompressor=threshold=-22dB:ratio=3:attack=15:release=180,volume=1.15[v];[1:a]highpass=f=280,lowpass=f=2600,tremolo=f=7:d=0.16,volume=0.15[n1];[2:a]highpass=f=1600,lowpass=f=7200,volume=0.045[n2];[v][n1][n2]amix=inputs=3:duration=first:normalize=0,afade=t=in:st=0:d=0.08,afade=t=out:st=2.65:d=0.45,alimiter=limit=0.58[out]",
    "-map", "[out]",
    "-ar", "48000",
    "-ac", "2",
    "-c:a", "libvorbis",
    "-q:a", "6",
    "-metadata", "title=Case 2 dryer playback demo master",
    "-metadata", "comment=Temporary system-voice performance; replace with directed actor recording before commercial release",
    resolve(root, "assets", "audio", "voice", "case2-dryer-message.ogg")
  ], "voice/case2-dryer-message.ogg");
}

function assertCommand(command, args, label) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    console.error(`${label} is required (${result.error?.message ?? result.stderr ?? "not found"})`);
    process.exit(1);
  }
}

function run(command, args, label) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log(`P1 audio ready: assets/audio/${label}`);
}
