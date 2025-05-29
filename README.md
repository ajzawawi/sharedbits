# 🧩 SharedBits

> ⚡ Upgrade anything, anywhere — using shared, reusable templates.

Built with ☕️, 💻, and the refusal to manually patch 47 services again.

---

**sharedbits** is a zero-boilerplate, config-driven CLI that upgrades any project based on shared logic and templates.

Whether you're evolving a React app, a Node service, a mono-repo utility, or just keeping configs up to date — `sharedbits` makes the process reproducible, auditable, and effortless.

---

🚀 Usage
```
# Apply upgrade logic for a specific version
npx sharedbits upgrade 1.0.0

# Preview what would change without writing anything
npx sharedbits upgrade 1.0.0 --dry-run
```
----


## ✨ What It Does

- 🔁 Applies versioned upgrade steps (1.0.0 → 2.0.0 → ...)
- 📦 Updates `package.json`, `.babelrc`, `.env`, `.eslintrc`, etc.
- 📝 Renders and replaces files using Handlebars templates
- ✍️ Edits lines of code, conditionally or directly
- 🤖 Runs codemods or shell commands (like `npx`, `eslint --fix`, or custom tools)
- 🧠 All behavior is driven by a simple `.platform` file
- 🧪 Dry-run support to preview changes
- ✅ Tested and Git-safe (required for codemods)
- ✅ Testable upgrade paths with Git-safe simulation

---

## 🧠 The `.platform` File

Drop a `.platform` config into your project root to define:

```ini
platformVersion=1.0.0
projectName=awesome-backend
nodeVersion=18.17.0
enableTelemetry=false
```

These values are available to:

Templates (.hbs)
Upgrade scripts
Conditional logic

---

## 🧰 Handlebars Templating
You can use .hbs templates for files like .babelrc, .eslintrc, Header.js, etc.

```
// templates/babelrc-1.0.0.hbs
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "comments": "Generated for {{projectName}} with Node {{nodeVersion}}"
}
```
---

## 🧠 Conditional Logic
Inside your upgrade scripts, use .platform variables for conditional behavior:

```
if (config.enableHeaderComponent === 'true') {
  await renderAndWriteTemplate(
    'templates/Header.js.hbs',
    'src/Header.js',
    config,
    dryRun
  );
}
```
---

## 🧪 Dry-Run Mode

```
npx sharedbits upgrade 1.0.0 --dry-run

```
Example output:

📝 Would write template to .babelrc

📝 Would replace in src/index.js: "import ReactDOM" → "import { createRoot"

🚫 Skipping codemods due to dry-run

---

## 🧪 Testable by Design

Every `sharedbits` upgrade is just code — and that means you can (and should) test it!

- ✅ Write dedicated tests for each upgrade version
- 🧪 Simulate a project using a test fixture
- 🐙 Git is automatically initialized so codemods can be tested
- 🧼 Clean temp folders after each test run

```
tests/
├── upgrades/
│   └── 1.0.0.test.js      ← Tests for upgrade 1.0.0
test-project/              ← Base project used in tests
test-temp/                 ← Isolated temp dirs per run
```

Sample test

```
test('Upgrade 1.0.0 adds Header if enabled', async () => {
  const testPath = await prepareTestProject('1.0.0');
  await upgrade({ dryRun: false });

  const code = fs.readFileSync(path.join(testPath, 'src/Header.js'), 'utf-8');
  expect(code).toContain('Welcome to');
});
```

✅ Automatically sets up Git for codemod safety

✅ Supports .platform config per test

✅ Fully isolated via temporary folders

---

## 🧬 Built For
Developer platforms managing 1+ features

Teams standardizing infrastructure, packages, and configs

---

## 🛠 Roadmap
☐  init command to scaffold a .platform file

☐  diff mode to preview before/after

☐  Auto-run all upgrades from current to latest version

☐  Remote template support (e.g. Git repo or S3)

☐  Plugin support for reusable steps (sharedbits-plugin-*)
