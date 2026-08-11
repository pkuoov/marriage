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

Install the locked dependency graph, then run these before any Steam upload:

```bash
npm ci
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

### Local packaged-runtime verification

After `npm run package:win` and `npm run verify:win-package` pass on Windows, launch the exact packaged executable through the same hidden smoke entry used by CI:

```powershell
$exe = Get-ChildItem dist/steam/*.exe | Select-Object -First 1
$report = Join-Path (Resolve-Path dist/steam) "windows-runtime-smoke.json"
$process = Start-Process -FilePath $exe.FullName -ArgumentList "--release-smoke-report=$report" -Wait -PassThru
if ($process.ExitCode -ne 0) { throw "Packaged runtime smoke exited with code $($process.ExitCode)" }
npm run verify:win-runtime-smoke
```

Treat the package as locally verified only when all four release files exist, the executable exits with code 0, and both verification commands pass. `verify:win-package` proves the file is a Windows PE artifact and records its checksum; it does not prove that the file carries an Authenticode signature.

### Generated files on Windows

Content freshness checks compare generated output byte for byte. The tracked files under `docs/generated/` and `src/generated/` are therefore pinned to LF in `.gitattributes`, regardless of the developer's `core.autocrlf` setting.

If `npm run check` reports a stale content index or readable script after a content change, regenerate and inspect the diff before committing:

```bash
npm run content:index
npm run content:script -- steam-demo-01
npm run check
```

Do not silence a real generated-report diff as a line-ending issue. `git diff --name-only` should identify any substantive changes after Git normalization.

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

The portable executable may still be suitable for internal testing while these gates remain open, but label it as an unsigned internal build. Before external distribution, verify all of the following:

- `Get-AuthenticodeSignature <path-to-exe>` reports `Valid`, not merely that packaging succeeded.
- `desktop/electron-builder.json` points to `assets/icons/livestream-detective-app-icon.png`; `npm run steam:preflight` fails when that approved icon is missing.
- The staged package metadata contains the intended `description` and `author`; electron-builder warnings about either field must be resolved.
- SmartScreen behavior is checked on a clean Windows machine that has not previously trusted the file.

## External Release Gates

- Clean physical Windows launch, SmartScreen behavior, audio-device output, and crash-log inspection.
- Windows SmartScreen/signing behavior.
- Steam Cloud configuration in Steamworks.
- Steam Deck controller feel and suspend/resume.
- Steam overlay behavior.
