const program = require('commander');

program
  .version('0.1.0')
  .command('feature')
  .description('generate a feature')
  .action(() => {
    console.log("I'm a new cli");
  });
