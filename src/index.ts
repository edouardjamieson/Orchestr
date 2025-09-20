#!/usr/bin/env node
import { Command } from 'commander';
import { CommandList, CommandRun, CommandValidate } from './lib/commands';

const program = new Command();

program.name('orchestr').description('A CLI builder for TypeScript');

// Default command (run script)
program
  .command('run', { isDefault: true })
  .argument('[args...]', 'Catch all arguments/flags provided.')
  .allowUnknownOption()
  .description('run the CLI')
  .action(args => {
    // List command
    if (args[0] === '-l' || args[0] === '--list') {
      new CommandList({ cmdArgs: args });
      return;
    }

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
