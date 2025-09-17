import { Command } from 'commander';
import { CommandRun, CommandValidate } from './lib/commands';

const program = new Command();

program
  .name('ts-cli-builder')
  .description('A CLI builder for TypeScript')
  .version('0.0.1');

// Default command (run script)
program
  .command('run', { isDefault: true })
  .argument('[args...]', 'Catch all arguments/flags provided.')
  .allowUnknownOption()
  .description('run the CLI')
  .action(args => {
    new CommandRun({ cmdArgs: args });
  });

// Validate command
program
  .command('validate')
  .argument('[args...]', 'Catch all arguments/flags provided.')
  .allowUnknownOption()
  .description('validate the CLI')
  .action(args => {
    new CommandValidate({ cmdArgs: args });
  });

program.parse(process.argv);
