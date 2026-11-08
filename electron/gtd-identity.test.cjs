const test = require('node:test');
const assert = require('node:assert/strict');
const { join } = require('node:path');
const { readFileSync } = require('node:fs');
require('ts-node/register/transpile-only');
const { applyGtdIdentity } = require('./gtd-identity.ts');

test('pins settings, Chromium storage and logs under a separate GTD profile', () => {
  const paths = { userData: '/config/superProductivity', sessionData: '/config/superProductivity' };
  const app = {
    getPath: (key) => { assert.equal(key, 'appData'); return '/config'; },
    setName: (name) => assert.equal(name, 'Super Productivity GTD'),
    setPath: (key, value) => { paths[key] = value; },
    setAppLogsPath: (value) => { paths.logs = value; },
  };
  applyGtdIdentity(app);
  assert.deepEqual(paths, {
    userData: join('/config', 'super-productivity-gtd'),
    sessionData: join('/config', 'super-productivity-gtd'),
    logs: join('/config', 'super-productivity-gtd', 'logs'),
  });
});

test('refuses a custom profile pointing to the original without touching it', () => {
  process.argv.push('--user-data-dir=/config/superProductivity');
  try {
    assert.throws(() => applyGtdIdentity({}), /isolated data directory/);
  } finally {
    process.argv.pop();
  }
});

test('applies GTD isolation after Snap resolution and before the singleton lock', () => {
  const main = readFileSync(join(__dirname, 'main.ts'), 'utf8');
  assert.ok(main.indexOf('applySnapUserDataDir(app);') < main.indexOf('applyGtdIdentity(app);'));
  assert.ok(main.indexOf('applyGtdIdentity(app);') < main.indexOf('app.requestSingleInstanceLock()'));
});
