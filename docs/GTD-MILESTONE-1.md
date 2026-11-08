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

Output: `.tmp/app-builds/super-productivity-gtd-x64.AppImage` and `.tmp/app-builds/super-productivity-gtd-x64.deb`. The command builds and checks sources, then packages with `--publish never`.

To intentionally omit the optional native Wayland idle helper on machines without Cargo, prefix the build command with `SP_SKIP_WAYLAND_IDLE_HELPER_BUILD=1`. Task tracking works, but native Wayland idle detection via ext-idle-notify is unavailable. X11 idle detection retains its existing implementation.

## Linux Mint verification

1. Leave the existing Flatpak installed. Close it initially to make identifying the new window easier.
2. Make the AppImage executable in file properties and launch it. If FUSE is unavailable, run `./super-productivity-gtd-x64.AppImage --appimage-extract-and-run`.
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
