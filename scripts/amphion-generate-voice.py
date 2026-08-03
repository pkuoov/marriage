#!/usr/bin/env python3
"""Generate internal dialogue-voice candidates with a separately installed Amphion.

This wrapper intentionally does not promote files into assets/audio/voice. The pinned
official Vevo checkpoint is marked non-commercial, so outputs are evaluation material
until the project records separate commercial rights and reference-speaker consent.
"""

from __future__ import annotations

import argparse
import json
import os
import random
import subprocess
import sys
import wave
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = REPO_ROOT / "assets/audio/voice/amphion-production.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    selection = parser.add_mutually_exclusive_group(required=True)
    selection.add_argument("--cue", help="Semantic cue id from the voice manifest")
    selection.add_argument("--all-ready", action="store_true", help="Generate every job whose reference WAV/text are ready")
    parser.add_argument("--amphion-root", required=True, type=Path, help="Pinned Amphion checkout")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--cache-dir", type=Path, help="Hugging Face cache; defaults outside this repository")
    parser.add_argument("--output-dir", type=Path, help="Override the ignored generation directory")
    parser.add_argument("--takes", type=int, help="Override the number of generated takes")
    parser.add_argument("--seed", type=int, help="Override the first seed")
    parser.add_argument("--flow-matching-steps", type=int, default=32)
    parser.add_argument("--allow-cpu", action="store_true", help="Allow the very slow CPU fallback")
    parser.add_argument("--dry-run", action="store_true", help="Validate and print the plan without importing models")
    parser.add_argument(
        "--acknowledge-noncommercial-evaluation",
        action="store_true",
        help="Required for generation with the listed non-commercial checkpoint",
    )
    parser.add_argument(
        "--confirm-reference-consent",
        action="store_true",
        help="Confirm that the reference speaker consented to this voice-generation use",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    manifest_path = args.manifest.expanduser().resolve()
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    defaults = manifest.get("defaults", {})
    if manifest.get("policy", {}).get("commercialReleaseAllowed") is not False:
        stop("Manifest safety error: official checkpoint must remain internal-evaluation-only")
    if args.all_ready and args.output_dir:
        stop("--output-dir can only be used with one --cue; batch jobs keep their isolated manifest directories")

    raw_jobs = manifest.get("jobs", [])
    if args.cue:
        raw_jobs = [item for item in raw_jobs if item.get("cueId") == args.cue]
        if not raw_jobs:
            stop(f"Unknown voice cue: {args.cue}")

    amphion_root = args.amphion_root.expanduser().resolve()
    expected_code_revision = manifest["upstream"]["code"]["revision"]
    verify_checkout(amphion_root, expected_code_revision)
    if args.flow_matching_steps < 8 or args.flow_matching_steps > 100:
        stop("--flow-matching-steps must be between 8 and 100")

    plans = []
    engine = None
    for raw_job in raw_jobs:
        job = {**defaults, **raw_job}
        engine_id = job.get("engine", defaults.get("engine"))
        if engine_id != "vevo-tts":
            stop(f"This wrapper currently supports vevo-tts only; {job['cueId']} requests {engine_id}")
        job_engine = manifest.get("upstream", {}).get("engines", {}).get(engine_id)
        if not job_engine:
            stop(f"Missing engine configuration: {engine_id}")
        if job_engine.get("commercialReleaseAllowed") is not False:
            stop("Engine safety error: official Vevo checkpoint must remain marked non-commercial")
        if engine is not None and engine["revision"] != job_engine["revision"]:
            stop("One batch cannot mix Vevo model revisions")
        engine = job_engine

        reference_wav = repo_path(job["referenceWav"])
        reference_text_path = repo_path(job["referenceTranscript"])
        missing = []
        if not reference_wav.is_file():
            missing.append("WAV")
        if not reference_text_path.is_file():
            missing.append("transcript")
        reference_text = reference_text_path.read_text(encoding="utf-8").strip() if reference_text_path.is_file() else ""
        if reference_text_path.is_file() and not reference_text:
            missing.append("non-empty transcript")
        profile = manifest.get("speakerProfiles", {}).get(job.get("speakerProfileId"), {})
        if reference_text and reference_text != profile.get("referenceScript", "").strip():
            stop(f"{job['cueId']}: local transcript differs from the committed reference script")
        if missing:
            if args.all_ready:
                print(f"Skipping {job['cueId']}: missing {', '.join(missing)}", file=sys.stderr)
                continue
            stop(f"{job['cueId']}: missing consented reference {', '.join(missing)}")
        reference_audio = inspect_reference_wav(reference_wav)

        takes = args.takes if args.takes is not None else int(job["takes"])
        first_seed = args.seed if args.seed is not None else int(job["seedBase"])
        if takes < 1 or takes > 12:
            stop("--takes must be between 1 and 12")
        output_dir = args.output_dir.expanduser().resolve() if args.output_dir else repo_path(job["generationDirectory"])
        require_ignored_generation_path(output_dir, manifest)
        plans.append({
            "cueId": job["cueId"],
            "purpose": manifest["policy"]["purpose"],
            "commercialReleaseAllowed": False,
            "amphionRoot": str(amphion_root),
            "amphionRevision": expected_code_revision,
            "modelRepository": job_engine["modelRepository"],
            "modelRevision": job_engine["revision"],
            "modelLicense": job_engine["license"],
            "referenceWav": str(reference_wav),
            "referenceAudio": reference_audio,
            "referenceTranscript": str(reference_text_path),
            "targetTranscript": job["transcript"],
            "sourceLanguage": job.get("sourceLanguage", "zh"),
            "referenceLanguage": job.get("referenceLanguage", "zh"),
            "outputDirectory": str(output_dir),
            "takes": takes,
            "seeds": [first_seed + index for index in range(takes)],
            "flowMatchingSteps": args.flow_matching_steps,
        })
    if not plans:
        stop("No voice jobs have both a consented reference WAV and exact transcript")

    cache_dir = (args.cache_dir.expanduser().resolve() if args.cache_dir else amphion_root / "ckpts" / "Vevo")
    print(json.dumps(plans[0] if len(plans) == 1 else {"jobs": plans}, ensure_ascii=False, indent=2))
    if args.dry_run:
        return
    if not args.acknowledge_noncommercial_evaluation:
        stop("Generation requires --acknowledge-noncommercial-evaluation")
    if not args.confirm_reference_consent:
        stop("Generation requires --confirm-reference-consent")

    generate(plans, engine, cache_dir, args.allow_cpu)


def generate(
    plans: list[dict],
    engine: dict,
    cache_dir: Path,
    allow_cpu: bool,
) -> None:
    amphion_root = Path(plans[0]["amphionRoot"])
    sys.path.insert(0, str(amphion_root))
    old_cwd = Path.cwd()
    os.chdir(amphion_root)
    try:
        import numpy as np
        import torch
        from huggingface_hub import snapshot_download
        from models.vc.vevo.vevo_utils import VevoInferencePipeline, save_audio

        if torch.cuda.is_available():
            device = torch.device("cuda")
        elif allow_cpu:
            device = torch.device("cpu")
            print("WARNING: Vevo CPU inference is allowed but may be impractically slow.", file=sys.stderr)
        else:
            stop("No CUDA device found. Run on Linux/NVIDIA or explicitly pass --allow-cpu for a slow experiment.")

        cache_dir.mkdir(parents=True, exist_ok=True)
        snapshot = Path(
            snapshot_download(
                repo_id=engine["modelRepository"],
                repo_type="model",
                revision=engine["revision"],
                cache_dir=str(cache_dir),
                allow_patterns=[
                    "tokenizer/vq8192/*",
                    "contentstyle_modeling/PhoneToVq8192/*",
                    "acoustic_modeling/Vq8192ToMels/*",
                    "acoustic_modeling/Vocoder/*",
                ],
            )
        )
        pipeline = VevoInferencePipeline(
            content_style_tokenizer_ckpt_path=str(snapshot / "tokenizer/vq8192"),
            ar_cfg_path=str(amphion_root / "models/vc/vevo/config/PhoneToVq8192.json"),
            ar_ckpt_path=str(snapshot / "contentstyle_modeling/PhoneToVq8192"),
            fmt_cfg_path=str(amphion_root / "models/vc/vevo/config/Vq8192ToMels.json"),
            fmt_ckpt_path=str(snapshot / "acoustic_modeling/Vq8192ToMels"),
            vocoder_cfg_path=str(amphion_root / "models/vc/vevo/config/Vocoder.json"),
            vocoder_ckpt_path=str(snapshot / "acoustic_modeling/Vocoder"),
            device=device,
        )

        for plan in plans:
            output_dir = Path(plan["outputDirectory"])
            output_dir.mkdir(parents=True, exist_ok=True)
            reference_wav = plan["referenceWav"]
            reference_text = Path(plan["referenceTranscript"]).read_text(encoding="utf-8").strip()
            for seed in plan["seeds"]:
                random.seed(seed)
                np.random.seed(seed)
                torch.manual_seed(seed)
                if torch.cuda.is_available():
                    torch.cuda.manual_seed_all(seed)
                generated = pipeline.inference_ar_and_fm(
                    src_wav_path=None,
                    src_text=plan["targetTranscript"],
                    style_ref_wav_path=reference_wav,
                    timbre_ref_wav_path=reference_wav,
                    style_ref_wav_text=reference_text,
                    src_text_language=plan["sourceLanguage"],
                    style_ref_wav_text_language=plan["referenceLanguage"],
                    flow_matching_steps=plan["flowMatchingSteps"],
                    display_audio=False,
                )
                output_path = output_dir / f"take-{seed}.wav"
                save_audio(generated, output_path=str(output_path))
                print(f"Generated internal candidate take: {output_path}")
    finally:
        os.chdir(old_cwd)


def verify_checkout(amphion_root: Path, expected_revision: str) -> None:
    if not (amphion_root / "models/vc/vevo/vevo_utils.py").is_file():
        stop(f"Not an Amphion checkout with Vevo: {amphion_root}")
    result = subprocess.run(
        ["git", "-C", str(amphion_root), "rev-parse", "HEAD"],
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode != 0:
        stop("Amphion must be a git checkout so its pinned revision can be verified")
    actual = result.stdout.strip()
    if actual != expected_revision:
        stop(f"Amphion revision mismatch: expected {expected_revision}, found {actual}")


def inspect_reference_wav(path: Path) -> dict:
    try:
        with wave.open(str(path), "rb") as source:
            channels = source.getnchannels()
            sample_rate = source.getframerate()
            sample_width_bits = source.getsampwidth() * 8
            frames = source.getnframes()
    except (wave.Error, EOFError) as error:
        stop(f"Reference must be an uncompressed PCM WAV: {path} ({error})")
    duration = frames / sample_rate if sample_rate else 0
    if channels != 1:
        stop(f"Reference WAV must be mono, found {channels} channels: {path}")
    if sample_rate != 48000:
        stop(f"Reference WAV must be 48 kHz, found {sample_rate} Hz: {path}")
    if sample_width_bits not in (16, 24, 32):
        stop(f"Reference WAV must be 16/24/32-bit PCM, found {sample_width_bits}-bit: {path}")
    if duration < 8 or duration > 20:
        stop(f"Reference WAV must be 8–20 seconds, found {duration:.2f}s: {path}")
    return {
        "channels": channels,
        "sampleRate": sample_rate,
        "sampleWidthBits": sample_width_bits,
        "durationSeconds": round(duration, 3),
    }


def require_ignored_generation_path(output_dir: Path, manifest: dict) -> None:
    allowed = repo_path(manifest["paths"]["generationRoot"])
    try:
        output_dir.relative_to(allowed)
    except ValueError:
        stop(f"Output directory must remain under ignored generation root: {allowed}")


def repo_path(value: str) -> Path:
    path = Path(value).expanduser()
    return path.resolve() if path.is_absolute() else (REPO_ROOT / path).resolve()


def stop(message: str) -> None:
    raise SystemExit(message)


if __name__ == "__main__":
    main()
