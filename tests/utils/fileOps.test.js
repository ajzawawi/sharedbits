const fs = require('fs-extra');
const path = require('path');
const {
  replaceInFile,
  renderAndWriteTemplate,
} = require('../../utils/fileOps');

const testDir = path.join(__dirname, '../../temp-fixtures/test-dir');

beforeEach(() => {
  fs.ensureDirSync(testDir);
});

afterEach(() => {
  fs.removeSync(testDir);
});

test('replaceInFile replaces target string in file', async () => {
  const filePath = path.join(testDir, 'sample.js');
  await fs.writeFile(filePath, 'console.log("dev")');

  await replaceInFile(filePath, 'dev', 'prod');

  const content = await fs.readFile(filePath, 'utf-8');
  expect(content).toBe('console.log("prod")');
});

test('renderAndWriteTemplate writes rendered handlebars template', async () => {
  const templatePath = path.join(testDir, 'test.hbs');
  const outputPath = path.join(testDir, 'output.js');

  await fs.writeFile(templatePath, 'Hello {{name}}!');
  await renderAndWriteTemplate(templatePath, outputPath, { name: 'AJ' });

  const output = await fs.readFile(outputPath, 'utf-8');
  expect(output).toBe('Hello AJ!');
});
