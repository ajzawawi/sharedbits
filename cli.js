#!/usr/bin/env node
const { Command } = require('commander');
const chalk = require('chalk');
const upgrades = {
  '1.0.0': require('./upgrades/1.0.0'),
  '2.0.0': require('./upgrades/2.0.0'),
};

const program = new Command();

program
  .name('platform-upgrader')
  .description('CLI to upgrade the core platform projects')
  .version('1.0.0');

  program
  .command('upgrade')
  .argument('<version>', 'Target platform release version')
  .option('--dry-run', 'Show what would change without writing files')
  .action(async (version, options) => {
    const upgradeFn = upgrades[version];
    if (!upgradeFn) {
      console.error(`No upgrade defined for version ${version}`);
      process.exit(1);
    }

    try {
      const dryRun = !!options.dryRun;
      console.log(`🔧 Running upgrade to ${version} ${dryRun ? '(dry-run)' : ''}`);
      await upgradeFn({ dryRun });
      if (dryRun) console.log('🧪 Dry-run complete. No files were modified.');
      else console.log('✅ Upgrade complete.');
    } catch (err) {
      console.error('❌ Upgrade failed:', err.message);
      process.exit(1);
    }
  });
  
program.parse();

