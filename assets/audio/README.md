# Audio asset staging

Runtime cue ids and planned file paths live in `src/audioCatalog.js`.

- `bgm/`: looping music beds and the pressure stem.
- `ambience/`: looping room and location beds.
- `sfx/`: one-shot interface, broadcast, phone, document, and case foley.
- `voice/`: semantic recordings. Every clue-bearing recording must keep a visible transcript in content.

`npm run verify:audio` allows `planned` entries to be absent and requires every `ready` file-backed entry to exist under this directory. Change a cue to `ready` only when the final asset is present.

The six demo-critical SFX under `sfx/` are original repository-generated foley assets, including the case 1 lamp-stand scrape. Rebuild them with `npm run audio:prototype`; the generator requires `ffmpeg` with `libvorbis`.

The initial P1 playable audio pass added title and pressure placeholders, two ambience beds, the case 2 dryer playback, and a short case 2 door-knock cue. The runtime title and pressure files have since been replaced by approved Udio masters. `npm run audio:p1` rebuilds the two ambience beds, the knock, and the dryer demo, so it cannot overwrite either approved music file; use `npm run audio:p1 -- --sfx-only` to rebuild only the knock. The dryer clip uses the macOS `Tingting` system voice with an authored phone/dryer mix, remains paired with a visible transcript, and is a demo master only: replace its performance with a directed actor recording before commercial release.

The Udio runtime pass promotes eight BGM slots into the playable build: `title-neon-rain.ogg`, `live-call.ogg`, `pressure-stem.ogg`, `offair-desk.ogg`, `day-investigation.ogg`, `callback-return.ogg`, `accusation.ogg`, and `recap-afterhours.ogg`. The seven non-title loops are reproducible from `bgm-production.json` with `npm run audio:bgm -- build <recipe-id> --force`. Their approved source WAV files are kept locally under `unchanged/`, ignored by Git, and copied to the external archive documented below.

Three BGM variants still require approved source material: `live-call-allegro`, `pursuit`, and `epilogue-dawn`. Until delivery, runtime plans fall back to `live-call`, `accusation`, and `recap-afterhours` respectively. Planned ambience cues likewise fall back to the ready `studio-room` or `city-afternoon` bed, and planned phone endings fall back to `phone-disconnect`; missing optional assets therefore do not create silent scenes.

Raw-master retention decisions are recorded in [`../../docs/audio-asset-retention-audit-2026-09-04.md`](../../docs/audio-asset-retention-audit-2026-09-04.md). The seven approved masters were checksum-verified in `~/Documents/love-audio-archive/2026-09-04/selected-masters/` before Git tracking was removed. Five explicitly selected reserve masters remain tracked.

`voice/recording-manifest.json` is the actor handoff contract. It fixes the exact line, role, performance direction, edit notes, destination path, and production status for every voice cue. `npm run verify:audio` rejects an actor-required cue marked ready and rejects a temporary system master presented as an approved actor master.

`voice/amphion-production.json` is the reproducible internal-evaluation plan for those same six cues. It pins upstream code/model revisions, character reference slots, exact transcripts, deterministic take seeds, and review processing. The listed official checkpoints are non-commercial: raw references and generated takes stay under ignored `source/`, staged candidates under ignored `review/`, and inspection reports under ignored `reports/`. Use `npm run audio:voice -- help`; this pipeline deliberately cannot promote a synthetic candidate into a runtime master.
