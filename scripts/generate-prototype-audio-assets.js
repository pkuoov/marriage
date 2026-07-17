import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(root, "assets", "audio", "sfx");
const ffmpeg = process.env.FFMPEG_BIN || "ffmpeg";

const assets = [
  {
    file: "phone-connect.ogg",
    title: "Hotline connect",
    inputs: [
      "sine=frequency=520:sample_rate=48000:duration=0.18",
      "sine=frequency=820:sample_rate=48000:duration=0.20",
      "anoisesrc=color=pink:sample_rate=48000:duration=0.40:amplitude=0.08"
    ],
    filter: "[0:a]volume=0.20,afade=t=out:st=0.11:d=0.07[a0];[1:a]volume=0.14,adelay=130|130,afade=t=out:st=0.25:d=0.07[a1];[2:a]highpass=f=2200,lowpass=f=6500,volume=0.025,afade=t=out:st=0.30:d=0.10[n];[a0][a1][n]amix=inputs=3:normalize=0,volume=14,alimiter=limit=0.5[out]"
  },
  {
    file: "phone-disconnect.ogg",
    title: "Hotline disconnect",
    inputs: [
      "sine=frequency=700:sample_rate=48000:duration=0.14",
      "sine=frequency=420:sample_rate=48000:duration=0.28",
      "anoisesrc=color=pink:sample_rate=48000:duration=0.48:amplitude=0.08"
    ],
    filter: "[0:a]volume=0.17,afade=t=out:st=0.08:d=0.06[a0];[1:a]volume=0.13,adelay=105|105,afade=t=out:st=0.27:d=0.11[a1];[2:a]highpass=f=1900,lowpass=f=5200,volume=0.022,afade=t=out:st=0.30:d=0.18[n];[a0][a1][n]amix=inputs=3:normalize=0,volume=17,alimiter=limit=0.5[out]"
  },
  {
    file: "broadcast-on-air.ogg",
    title: "ON AIR relay",
    inputs: [
      "anoisesrc=color=white:sample_rate=48000:duration=0.10:amplitude=0.45",
      "sine=frequency=95:sample_rate=48000:duration=0.22",
      "sine=frequency=1550:sample_rate=48000:duration=0.05"
    ],
    filter: "[0:a]highpass=f=1200,lowpass=f=7200,volume=0.18,afade=t=out:st=0.025:d=0.075[c];[1:a]volume=0.16,afade=t=in:st=0:d=0.012,afade=t=out:st=0.08:d=0.14[t];[2:a]volume=0.10,adelay=65|65,afade=t=out:st=0.085:d=0.03[r];[c][t][r]amix=inputs=3:normalize=0,volume=4.5,alimiter=limit=0.5[out]"
  },
  {
    file: "message-notification.ogg",
    title: "Backstage message notification",
    inputs: [
      "sine=frequency=880:sample_rate=48000:duration=0.12",
      "sine=frequency=1175:sample_rate=48000:duration=0.15",
      "sine=frequency=1760:sample_rate=48000:duration=0.09"
    ],
    filter: "[0:a]volume=0.11,afade=t=out:st=0.06:d=0.06[a0];[1:a]volume=0.09,adelay=90|90,afade=t=out:st=0.16:d=0.08[a1];[2:a]volume=0.045,adelay=185|185,afade=t=out:st=0.22:d=0.055[a2];[a0][a1][a2]amix=inputs=3:normalize=0,volume=25,alimiter=limit=0.5[out]"
  },
  {
    file: "document-mark.ogg",
    title: "Document pencil mark",
    inputs: [
      "anoisesrc=color=white:sample_rate=48000:duration=0.34:amplitude=0.32",
      "anoisesrc=color=brown:sample_rate=48000:duration=0.30:amplitude=0.18"
    ],
    filter: "[0:a]highpass=f=1250,lowpass=f=6500,tremolo=f=27:d=0.62,volume=0.12,afade=t=in:st=0:d=0.025,afade=t=out:st=0.22:d=0.12[s];[1:a]highpass=f=180,lowpass=f=1050,volume=0.045,afade=t=out:st=0.18:d=0.12[p];[s][p]amix=inputs=2:normalize=0,volume=13,alimiter=limit=0.5[out]"
  }
];

const version = spawnSync(ffmpeg, ["-version"], { encoding: "utf8" });
if (version.status !== 0) {
  console.error(`ffmpeg is required to build prototype audio assets (${version.error?.message ?? "not found"})`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
for (const asset of assets) {
  const args = ["-hide_banner", "-loglevel", "error", "-y"];
  asset.inputs.forEach((input) => args.push("-f", "lavfi", "-i", input));
  args.push(
    "-filter_complex", asset.filter,
    "-map", "[out]",
    "-ar", "48000",
    "-ac", "2",
    "-c:a", "libvorbis",
    "-q:a", "6",
    "-metadata", `title=${asset.title}`,
    resolve(outputDir, asset.file)
  );
  const result = spawnSync(ffmpeg, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log(`Audio asset ready: assets/audio/sfx/${asset.file}`);
}
