const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const handlebars = require('handlebars');


async function updatePackageJsonDeps(newDeps) {
  const pkgPath = path.resolve('package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));

  for (const dep in newDeps) {
    if (pkg.dependencies?.[dep]) {
      pkg.dependencies[dep] = newDeps[dep];
    } else if (pkg.devDependencies?.[dep]) {
      pkg.devDependencies[dep] = newDeps[dep];
    } else {
      pkg.dependencies ??= {};
      pkg.dependencies[dep] = newDeps[dep];
    }
  }

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
  console.log(`📦 Updated package.json dependencies`);
}

async function replaceFile(target, sourceTemplate) {
  const content = await fs.readFile(sourceTemplate, 'utf-8');
  await fs.writeFile(target, content);
  console.log(`📁 Replaced file: ${target}`);
}

async function replaceInFile(filePath, searchText, replaceText, dryRun = false) {
  const content = await fs.readFile(filePath, 'utf-8');
  const updated = content.replace(searchText, replaceText);
  if (content === updated) return;

  if (dryRun) {
    console.log(`📝 Would replace in ${filePath}: "${searchText}" → "${replaceText}"`);
  } else {
    await fs.writeFile(filePath, updated);
    console.log(`✏️ Replaced in ${filePath}: "${searchText}" → "${replaceText}"`);
  }
}

function runCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');

    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32', // needed on Windows
      ...options,
    });

    child.on('exit', (code) => {
      if (code !== 0) reject(new Error(`${command} exited with code ${code}`));
      else resolve();
    });

    child.on('error', (err) => reject(err));
  });
}

async function renderAndWriteTemplate(templatePath, destinationPath, variables, dryRun = false) {
  const templateRaw = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateRaw);
  const output = template(variables);

  if (dryRun) {
    console.log(`📝 Would write template to ${destinationPath}:\n${output}`);
  } else {
    await fs.writeFile(destinationPath, output);
    console.log(`📄 Wrote rendered template to ${destinationPath}`);
  }
}

module.exports = {
  updatePackageJsonDeps,
  replaceFile,
  replaceInFile,
  renderAndWriteTemplate,
  runCommand
};
