#!/usr/bin/env node
import { Command } from 'commander';
import { CommandList, CommandRun, CommandValidate } from './lib/commands';

const program = new Command();

program
  .name('Orchestr')
  .description('Powerful JSON-based task automation for developers')
  .usage('npx orchestr@latest <script-name>');

// Default command (run script)
program
  .command('run', { isDefault: true })
  .argument('[args...]', 'Catch all arguments/flags provided.')
  .allowUnknownOption()
  .description('Run a script')
  .action(args => {
    // List command
    if (args[0] === '-l' || args[0] === '--list') {
      new CommandList({ cmdArgs: args });
      return;
    }

    // Run command
    new CommandRun({ cmdArgs: args });
  });

// Validate command
program
  .command('validate')
  .argument('[args...]', 'Catch all arguments/flags provided.')
  .allowUnknownOption()
  .description('Validate a script')
  .action(args => {
    new CommandValidate({ cmdArgs: args });
  });

program.parse(process.argv);
