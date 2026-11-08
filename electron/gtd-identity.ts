import type { App } from 'electron';
import { join } from 'path';

/** Pin storage before the single-instance lock, settings, backups or windows open. */
export const applyGtdIdentity = (app: App): void => {
  if (process.argv.some((arg) => arg.startsWith('--user-data-dir'))) {
    throw new Error(
      'GTD preview does not support overriding its isolated data directory.',
    );
  }
  const profile = join(app.getPath('appData'), 'super-productivity-gtd');
  app.setName('Super Productivity GTD');
  app.setPath('userData', profile);
  app.setPath('sessionData', profile);
  app.setAppLogsPath(join(profile, 'logs'));
};
