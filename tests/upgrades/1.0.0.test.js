const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const upgrade = require('../../upgrades/1.0.0');

const execAsync = util.promisify(exec);
const basePath = path.join(__dirname, '../../test-project');
const testPath = path.join(__dirname, '../../test-temp/1.0.0');

const tempRoot = path.resolve(__dirname, '../../test-temp');

jest.setTimeout(30000); // For npm install or slower CI

beforeAll(async () => {
  // 🧽 Prepare test dir
  fs.removeSync(testPath);
  fs.copySync(basePath, testPath);
  process.chdir(testPath);

  // 📦 Install dependencies for codemod to run
  console.log('📦 Installing dependencies...');
  await execAsync('npm install');

  console.log('Current working directory:', process.cwd());

  // 🧱 Initialize git to satisfy codemod requirements
  console.log('🧱 Initializing Git repo...');
  await execAsync('git init');
  await execAsync('git config user.name "Test Runner"');
  await execAsync('git config user.email "test@example.com"');
  await execAsync('git add .');
  await execAsync('git commit -m "initial commit"');

  console.log('✅ Git setup complete');
});

afterAll(() => {
  process.chdir(path.resolve(__dirname, '../../'));
  try {
    fs.removeSync(tempRoot);
    console.log('✅ Deleted:', testPath);
  } catch (err) {
    console.error('❌ Failed to delete testPath:', err.message);
  }
});

test('1.0.0 upgrade updates package.json, .babelrc and replaces imports', async () => {
  await upgrade();

  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  expect(pkg.dependencies.react).toBe('^17.0.2');

  const babelrc = fs.readFileSync('.babelrc', 'utf8');
  expect(babelrc).toContain('@babel/preset-react');

  const indexJs = fs.readFileSync('src/index.js', 'utf8');
  expect(indexJs).toContain("import { createRoot } from 'react-dom/client'");
});
