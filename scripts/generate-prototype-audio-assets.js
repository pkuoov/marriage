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
    title: "Soft hotline connect",
    inputs: [
      "sine=frequency=360:sample_rate=48000:duration=0.30",
      "sine=frequency=480:sample_rate=48000:duration=0.26",
      "anoisesrc=color=pink:sample_rate=48000:duration=0.34:amplitude=0.03"
    ],
    filter: "[0:a]volume=0.11,afade=t=in:st=0:d=0.02,afade=t=out:st=0.13:d=0.17[a0];[1:a]volume=0.07,adelay=70|70,afade=t=in:st=0:d=0.02,afade=t=out:st=0.15:d=0.11[a1];[2:a]highpass=f=500,lowpass=f=1800,volume=0.012,afade=t=out:st=0.20:d=0.14[n];[a0][a1][n]amix=inputs=3:normalize=0,lowpass=f=1600,volume=4.5,alimiter=limit=0.28[out]"
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
    title: "Soft ON AIR relay",
    inputs: [
      "anoisesrc=color=brown:sample_rate=48000:duration=0.16:amplitude=0.12",
      "sine=frequency=240:sample_rate=48000:duration=0.28",
      "sine=frequency=480:sample_rate=48000:duration=0.18"
    ],
    filter: "[0:a]highpass=f=90,lowpass=f=1200,volume=0.035,afade=t=out:st=0.045:d=0.115[c];[1:a]volume=0.09,afade=t=in:st=0:d=0.018,afade=t=out:st=0.10:d=0.18[t];[2:a]volume=0.045,adelay=55|55,afade=t=in:st=0:d=0.012,afade=t=out:st=0.09:d=0.09[r];[c][t][r]amix=inputs=3:normalize=0,lowpass=f=1400,volume=4.2,alimiter=limit=0.25[out]"
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
  },
  {
    file: "case2-distant-siren.ogg",
    title: "Case 2 distant police siren arrival",
    inputs: [
      "sine=frequency=610:sample_rate=48000:duration=4.2",
      "sine=frequency=790:sample_rate=48000:duration=4.2",
      "anoisesrc=color=pink:sample_rate=48000:duration=4.2:amplitude=0.025"
    ],
    filter: "[0:a]tremolo=f=0.72:d=0.90,volume=0.035,afade=t=in:st=0:d=0.8,afade=t=out:st=3.1:d=1.1[low];[1:a]tremolo=f=0.72:d=0.90,adelay=690|690,volume=0.022,afade=t=in:st=0.69:d=0.8,afade=t=out:st=3.0:d=1.2[high];[2:a]highpass=f=90,lowpass=f=900,volume=0.015,afade=t=in:st=0:d=0.6,afade=t=out:st=3.0:d=1.2[street];[low][high][street]amix=inputs=3:normalize=0,lowpass=f=1800,aecho=0.7:0.25:120|260:0.10|0.06,volume=70,alimiter=limit=0.28[out]"
  }
];

const version = spawnSync(ffmpeg, ["-version"], { encoding: "utf8" });
if (version.status !== 0) {
  console.error(`ffmpeg is required to build prototype audio assets (${version.error?.message ?? "not found"})`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
const requestedFiles = new Set(process.argv.slice(2));
const selectedAssets = requestedFiles.size ? assets.filter((asset) => requestedFiles.has(asset.file)) : assets;
const unknownFiles = [...requestedFiles].filter((file) => !assets.some((asset) => asset.file === file));
if (unknownFiles.length) {
  console.error(`Unknown prototype audio asset: ${unknownFiles.join(", ")}`);
  process.exit(1);
}
for (const asset of selectedAssets) {
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
