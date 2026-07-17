# Audio asset staging

Runtime cue ids and planned file paths live in `src/audioCatalog.js`.

- `bgm/`: looping music beds and the pressure stem.
- `ambience/`: looping room and location beds.
- `sfx/`: one-shot interface, broadcast, phone, document, and case foley.
- `voice/`: semantic recordings. Every clue-bearing recording must keep a visible transcript in content.

`npm run verify:audio` allows `planned` entries to be absent and requires every `ready` file-backed entry to exist under this directory. Change a cue to `ready` only when the final asset is present.

The five demo-critical SFX under `sfx/` are original repository-generated foley assets. Rebuild them with `npm run audio:prototype`; the generator requires `ffmpeg` with `libvorbis`. Voice, ambience, and BGM entries remain `planned` until authored recordings or music beds are delivered.
