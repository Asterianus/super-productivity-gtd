# Super Productivity GTD — Milestone 1

## Scope

A separate Linux desktop edition with an integrated GTD entry screen. It retains native Projects, Tasks, tags, timer and local persistence. Goals are explicitly a planned feature, not tags or a completed implementation. The initial Next Actions list shows unfinished tasks tagged `NA` across active Projects; Context links use `c-` tags. Graphical assignment, filters, saved defaults and priority inheritance are later milestones.

## Isolation

- Package and executable: `super-productivity-gtd`.
- Display name: **Super Productivity GTD**.
- Desktop entry / WM_CLASS: `super-productivity-gtd`.
- Application ID: `io.github.Asterianus.SuperProductivityGTD`.
- URL scheme: `superproductivity-gtd://`.
- Linux profile: `$XDG_CONFIG_HOME/super-productivity-gtd`, normally `~/.config/super-productivity-gtd`.
- Settings, IndexedDB, Chromium session, logs and automatic backups remain in that profile.
- Storage is pinned before Electron's single-instance lock. No existing data is migrated or imported. Custom `--user-data-dir` overrides are refused in this preview.
- Synchronisation starts disabled with no provider, using upstream defaults. Do not configure sync or import existing backups during the initial isolation test.

## Build locally without paid services

Use Node and npm versions declared in `package.json` (Volta configuration). Install Linux build prerequisites, including Rust/Cargo for the upstream Wayland idle helper and Electron runtime libraries. No GitHub Actions or publishing is required.

```bash
git clone --branch gtd-native-preview --single-branch https://github.com/Asterianus/super-productivity-gtd.git
cd super-productivity-gtd
npm ci
npm run dist:gtd:linux
```

Output: `.tmp/app-builds/super-productivity-gtd-x86_64.AppImage` and `.tmp/app-builds/super-productivity-gtd-amd64.deb`. The command builds and checks sources, then packages with `--publish never`.

To intentionally omit the optional native Wayland idle helper on machines without Cargo, prefix the build command with `SP_SKIP_WAYLAND_IDLE_HELPER_BUILD=1`. Task tracking works, but native Wayland idle detection via ext-idle-notify is unavailable. X11 idle detection retains its existing implementation.

## Linux Mint verification

1. Leave the existing Flatpak installed. Close it initially to make identifying the new window easier.
2. Make the AppImage executable in file properties and launch it. If FUSE is unavailable, run `./super-productivity-gtd-x86_64.AppImage --appimage-extract-and-run`.
3. Confirm the window is **Super Productivity GTD** and starts on the GTD dashboard with a fresh Inbox.
4. Add a disposable task in this edition. Close and relaunch; verify it persists.
5. Open the original Flatpak and confirm its Projects and Tasks are unchanged. Both editions should run together.
6. In GTD, add an `NA` tag and assign it to a disposable task; return to the dashboard and complete it using its checkbox. It must disappear from Next Actions and be complete in its native Project.
7. Add a `c-home` tag; its Context link should open the native tag view.
8. Disconnect networking and repeat task creation/completion and relaunch.

Alternatively install the DEB using the graphical package installer. Its package and executable names differ from the original. Do not use upstream `localInstall*` scripts; those are not the GTD packaging entry point.

## Implementation checkpoints

1. Inspect repository state and storage; establish isolated identity and dashboard.
2. Validate focused tests, frontend and Electron builds; package Linux artifacts.
3. Record actual checks and limitations here, commit source and publish artifacts for testing.

Validation results are added after executing the checks. A successful compile alone does not demonstrate Linux Mint launch compatibility.

## Verification — 8 November 2026

- `npm ci --no-audit --no-fund`: passed on Node 24.22.1 / npm 11.9.0 in this workspace. The repository declares Node 22.23.3 / npm 11.18.0; those exact versions were not tested here. The Nextcloud dependency emitted an engine warning.
- `npm run buildFrontend:prod:es6`: passed (production Angular compilation).
- `SP_SKIP_WAYLAND_IDLE_HELPER_BUILD=1 npm run electron:build`: passed.
- `npm run test:electron`: passed. The new isolation tests also ran separately: 3 passed, 0 failed.
- `npm run test:tools`: passed after aligning the RPM post-install link with the GTD identity.
- `npm run lint:css-vars`: passed.
- Required `checkFile` checks on modified TypeScript and SCSS: passed. `t.const.ts` is generated using `tools/extract-i18n-single.js` and excluded from ESLint; it is validated through the production build, not claimed as linted.
- Linux packaging with `electron-builder --linux AppImage deb --x64 --publish never`: passed. Both artifacts were produced. The optional Rust Wayland idle helper was intentionally omitted because Cargo is absent in this build environment.
- DEB metadata and maintainer script inspected: package, `/opt` installation path, executable, desktop entry, URL scheme and AppArmor profile use the GTD name. No Conflicts/Replaces field targeting the original package.
- Angular dashboard spec: its two tests compile after increasing the Node heap and setting one build worker, but **did not execute**. Chromium cannot create its singleton Unix socket in this workspace (`Operation not permitted`).
- Packaged Electron launch attempted with a disposable XDG configuration directory: **blocked before UI startup** by the same Unix socket restriction. Linux Mint launch, simultaneous use with the original Flatpak, rendered dark-theme appearance, task persistence, and checkbox interaction are **not yet runtime-verified**.

This is a built preview for Linux Mint testing, not a claim that Milestone 1's launch acceptance criterion has already passed. Run the checklist above before using it for real task data. GitHub Actions remained disabled; no paid infrastructure or services were used.
