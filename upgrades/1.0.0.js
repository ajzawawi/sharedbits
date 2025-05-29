const path = require('path');
const { updatePackageJsonDeps, replaceInFile, runCommand, renderAndWriteTemplate } = require('../utils/fileOps');
const { loadPlatformConfig } = require('../utils/platformConfig');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

module.exports = async function ({ dryRun = false } = {}) {
  const defaults = {
    projectName: 'default-app',
    reactVersion: '17.0.2',
    enableHeaderComponent: 'false'
  };
  
  const config = loadPlatformConfig(process.cwd(), defaults);

  await updatePackageJsonDeps({
    react: `^${config.reactVersion || '18.0.0'}`,
    'react-dom': `^${config.reactVersion || '18.0.0'}`
  }, dryRun);

  await renderAndWriteTemplate(
    path.join(__dirname, '../templates/babelrc-1.0.0.hbs'),
    '.babelrc',
    config,
    dryRun
  );

  await replaceInFile(
    'src/index.js',
    "import ReactDOM from 'react-dom';",
    "import { createRoot } from 'react-dom/client';",
    dryRun
  );

  // ✅ Conditional logic: insert Header
  if (config.enableHeaderComponent === 'true') {
    await renderAndWriteTemplate(
      path.join(__dirname, '../templates/Header.js.hbs'),
      'src/Header.js',
      config,
      dryRun
    );

    await replaceInFile(
      'src/index.js',
      '{{HEADER_IMPORT}}',
      "import Header from './Header';",
      dryRun
    );

    await replaceInFile(
      'src/index.js',
      '{{HEADER_USAGE}}',
      '<Header />',
      dryRun
    );
  } else {
    // If header not enabled, remove placeholders
    await replaceInFile('src/index.js', '{{HEADER_IMPORT}}', '', dryRun);
    await replaceInFile('src/index.js', '{{HEADER_USAGE}}', '', dryRun);
  }

  if (!dryRun) {
    await execAsync('git add .');
    await execAsync('git commit -m "intermediate upgrade changes"');
    await runCommand('npx react-codemod rename-unsafe-lifecycles src --parser=babel');
  } else {
    console.log('🚫 Skipping codemods due to dry-run');
  }
};
