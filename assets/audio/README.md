# Audio asset staging

Runtime cue ids and planned file paths live in `src/audioCatalog.js`.

- `bgm/`: looping music beds and the pressure stem.
- `ambience/`: looping room and location beds.
- `sfx/`: one-shot interface, broadcast, phone, document, and case foley.
- `voice/`: semantic recordings. Every clue-bearing recording must keep a visible transcript in content.

`npm run verify:audio` allows `planned` entries to be absent and requires every `ready` file-backed entry to exist under this directory. Change a cue to `ready` only when the final asset is present.

The six demo-critical SFX under `sfx/` are original repository-generated foley assets, including the case 1 lamp-stand scrape. Rebuild them with `npm run audio:prototype`; the generator requires `ffmpeg` with `libvorbis`.

The initial P1 playable audio pass added title and pressure placeholders, two ambience beds, and the case 2 dryer playback. The runtime title and pressure files have since been replaced by approved Udio masters. `npm run audio:p1` now rebuilds only the two ambience beds and the dryer demo, so it cannot overwrite either approved music file. The dryer clip uses the macOS `Tingting` system voice with an authored phone/dryer mix, remains paired with a visible transcript, and is a demo master only: replace its performance with a directed actor recording before commercial release.

The Udio runtime pass promotes six BGM slots into the playable build: `title-neon-rain.ogg`, `live-call.ogg`, `pressure-stem.ogg`, `offair-desk.ogg`, `day-investigation.ogg`, and `callback-return.ogg`. The five non-title loops are reproducible from `bgm-production.json` with `npm run audio:bgm -- build <recipe-id> --force`; their source WAV files remain untouched under `unchanged/`. `accusation`, `recap-afterhours`, and `epilogue-dawn` remain planned until approved source material exists.

`voice/recording-manifest.json` is the actor handoff contract. It fixes the exact line, role, performance direction, edit notes, destination path, and production status for every voice cue. `npm run verify:audio` rejects an actor-required cue marked ready and rejects a temporary system master presented as an approved actor master.
