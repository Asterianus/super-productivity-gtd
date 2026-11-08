#!/bin/bash
# rpm %posttrans for the .rpm (#11136). The desktop entry's Exec points at
# /usr/bin/super-productivity-gtd, because xdg-open discards a handler whose Exec path
# contains a space (/opt/Super Productivity GTD/...). On upgrade rpm runs the OLD
# package's %postun after the new %post, and electron-builder's after-remove
# script removes that link unconditionally. %posttrans runs last, so re-create
# it here, mirroring electron-builder's after-install.tpl. It does not run on
# erase, so uninstalling still removes the link.
APP_BIN='/opt/Super Productivity GTD/super-productivity-gtd'

if type update-alternatives >/dev/null 2>&1; then
    update-alternatives --install '/usr/bin/super-productivity-gtd' 'super-productivity-gtd' "$APP_BIN" 100 || ln -sf "$APP_BIN" '/usr/bin/super-productivity-gtd'
else
    ln -sf "$APP_BIN" '/usr/bin/super-productivity-gtd'
fi
