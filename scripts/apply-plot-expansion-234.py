#!/usr/bin/env python3
"""Archived pass-234 migration.

The payload predates the current case-spine canon and must not be replayed against
the live cases. It is kept only so old commits remain understandable.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CASES = ROOT / "content/packs/steam-demo-01/cases"
PAYLOAD = Path(__file__).resolve().parent / "_plot_expansion_234_payload"


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def save_case(name: str, data: dict) -> None:
    path = CASES / name
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)}")


def apply_hook_choices(data: dict, mapping: dict) -> None:
    for hook in data.get("investigationHooks") or []:
        hid = hook.get("id")
        if hid in mapping:
            hook["replyChoices"] = mapping[hid]


def patch_case(stem: str, spec: dict) -> None:
    name = f"{stem}.json"
    data = load_json(CASES / name)
    data["delegation"]["moment"] = "interlude:send-appraisal"
    data["hostWoundHook"] = spec["hostWoundHook"]
    for idx, text in spec.get("sceneVersions", {}).items():
        data["sceneVersions"][int(idx)]["version"] = text
    for idx, text in spec.get("revisedVersions", {}).items():
        data["sceneVersions"][int(idx)]["revisedVersion"] = text
    if "respondentNote" in spec:
        data["respondentNote"] = spec["respondentNote"]
    if spec.get("respondentNoteTease") and data.get("respondentNote"):
        data["respondentNote"]["teaseDuringSegment2"] = True
    if "advisorNotes" in spec:
        data["advisorNotes"] = spec["advisorNotes"]
    apply_hook_choices(data, spec.get("hookReplyChoices") or {})
    data.setdefault("runtimeLengthPlan", {})["whatPlayerDoesBesidesRead"] = spec["whatPlayerDoesBesidesRead"]
    data["nightStructure"] = load_json(PAYLOAD / f"{stem}-night.json")
    fix = spec.get("accusationFix")
    if fix:
        for choice in data.get("accusationChoices") or []:
            if fix.get("labelContains") and fix["labelContains"] in choice.get("label", ""):
                choice["label"] = fix["newLabel"]
                break
        data["quotePickCandidates"] = [
            str(choice.get("label", "")).strip().strip("“”\"").rstrip("。！？!?；;，,、：:").strip()
            for choice in data.get("accusationChoices") or []
        ]
    save_case(name, data)


def main() -> None:
    raise SystemExit(
        "archived migration: do not replay pass 234; edit the canonical case files instead"
    )
    specs = load_json(PAYLOAD / "patch-specs.json")
    for stem in ("02-tony", "03-profile", "04-workplace"):
        patch_case(stem, specs[stem])
    print("done: cases 2-4 patched (01-credit untouched)")


if __name__ == "__main__":
    main()
