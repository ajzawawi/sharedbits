const fs = require('fs-extra');
const path = require('path');
const { loadPlatformConfig } = require('../../utils/platformConfig');

const testDir = path.join(__dirname, '../../temp-fixtures/test-dir');

beforeEach(() => {
  fs.ensureDirSync(testDir);
});

afterEach(() => {
  fs.removeSync(testDir);
});

test('loadPlatformConfig parses basic .platform file', async () => {
  const platformFile = path.join(testDir, '.platform');
  await fs.writeFile(platformFile, 'projectName=sharedbits\nenableFeature=true');

  const config = loadPlatformConfig(testDir);
  expect(config.projectName).toBe('sharedbits');
  expect(config.enableFeature).toBe('true');
});

test('loadPlatformConfig applies default values', async () => {
  const config = loadPlatformConfig(testDir, {
    projectName: 'default',
    enableTelemetry: 'false',
  });

  expect(config.projectName).toBe('default');
  expect(config.enableTelemetry).toBe('false');
});
