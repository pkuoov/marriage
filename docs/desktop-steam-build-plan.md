# Desktop and Steam Build Plan

This document is the release checklist for turning the offline playable into a Steam-ready desktop demo. It separates what is already covered by local automation from what still needs a real Windows or Steam Deck machine.

## Current Shape

- `npm run build:playable` builds the offline web playable into `dist/playable`.
- `npm run build:desktop` builds `dist/desktop-electron` with `main.cjs`, `preload.cjs`, `package.json`, and the offline playable.
- `npm run smoke:desktop` verifies that desktop staging has no dev-server dependency and exposes the desktop bridge.
- `npm run smoke:browser` opens the offline playable in Chromium and replays click, keyboard, and simulated Gamepad API routes.
- `npm run package:win` is the Windows-native portable package entry. It intentionally fails on Mac/Linux. Electron 43 requires Node `>=22.12`; non-Windows hosts may run staging smoke but may not produce an accepted release executable.
- `.github/workflows/windows-package.yml` is the canonical packaging environment: Windows runner, Node 22.12, locked dependencies, source checks, portable packaging, PE/checksum validation, and a real packaged-runtime launch.

## Release Commands

Run these before any Steam upload:

```bash
npm run check
npm run build:h5
npm run smoke:browser
npm run build:steam
npm run smoke:desktop
npm run steam:preflight
```

On a Node `>=22.12` Windows packaging machine, or through the **Windows Portable Package** GitHub workflow:

```bash
npm run package:win
npm run verify:win-package
```

Expected artifact:

```text
dist/steam/LivestreamDetectiveDemo-0.1.0-x64.exe
dist/steam/LivestreamDetectiveDemo-0.1.0-x64.exe.sha256
dist/steam/windows-package-report.json
dist/steam/windows-runtime-smoke.json
```

Do not run `electron-builder --win` directly on macOS and treat the result as release evidence. Mac is approved for `build:desktop`, `smoke:desktop`, browser replay, and `steam:preflight`; Windows is the authority for the executable and packaged-runtime report.

## Automated Windows Runtime Gate

The Windows workflow launches the generated portable executable with a hidden release-smoke argument. During that run it:

1. blocks external hostname resolution;
2. loads the playable from `file:` and confirms the title screen exists;
3. confirms the desktop bridge is exposed through preload;
4. writes, reads, lists, prepares Cloud export for, and removes a temporary file save;
5. exits non-zero if any step fails and uploads the JSON report with the package.

This closes build reproducibility and basic offline startup/save behavior. It does not replace SmartScreen, real-controller, suspend/resume, audio-device, or Steam overlay checks on physical hardware.

## Steam Cloud Contract

The runtime storage layer is already split:

- Web uses localStorage through `createSaveStore`.
- Desktop can expose `platformRuntime.saveFiles`.
- Electron preload exposes `livestreamDetectiveDesktop.saveFiles`.
- Main process writes under Electron `userData`.

Steam Cloud should sync these file-backed save keys, not browser localStorage:

- `livestream-detective-save`
- `livestream-detective-meta`

Cloud setup in Steamworks should target the app's user-data save directory. Do not sync `crash-logs` or transient desktop settings unless Valve review specifically asks for it.

## Windows Smoke

After downloading a workflow artifact or running `npm run package:win` on Windows:

1. Launch the portable exe with network disabled.
2. Start a new run and reach the first current-node question.
3. Exit and reopen; confirm the run resumes from the same stage.
4. Toggle fullscreen and zoom in/out; close and reopen; confirm window state remains usable.
5. Finish the first case using only keyboard.
6. Check that no localhost or dev-server window appears.
7. Confirm `crash-logs` exists only after a real crash or renderer failure.

## Steam Deck Smoke

On Steam Deck or a real controller connected through Steam Input:

1. Add the desktop build as a non-Steam game or install through Steam branch.
2. Launch in Game Mode.
3. Use D-pad / left stick to move focus from title into the first case.
4. Use A to confirm, B to back/retry where available, Y to open review/recap where available.
5. Complete the first case without touchscreen or mouse.
6. Confirm text remains readable at 1280x800 and no button text clips.
7. Confirm suspend/resume does not corrupt the save.

## Signing and Store Packaging

Required before public Steam release:

- Windows signing certificate or explicit unsigned-portable release decision.
- Steam app id and depot layout.
- Steamworks branch for internal test.
- Store capsule/screenshots generated from the desktop build, not the dev server.
- Privacy note: no AI server, no account system, no telemetry in the offline demo unless explicitly added later.

## External Release Gates

- Clean physical Windows launch, SmartScreen behavior, audio-device output, and crash-log inspection.
- Windows SmartScreen/signing behavior.
- Steam Cloud configuration in Steamworks.
- Steam Deck controller feel and suspend/resume.
- Steam overlay behavior.
