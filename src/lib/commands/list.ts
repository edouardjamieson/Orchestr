import chalk from 'chalk';
import Utils from '../utils';
import DefaultCommand from './commands.service';
import { CommandOptions } from './commands.type';
import path from 'path';
import { existsSync } from 'fs';

export class CommandList extends DefaultCommand {
  constructor(props: CommandOptions) {
    super(props);

    // Launch greetings
    Utils.clearConsole();
    console.log(DefaultCommand.title);
    console.log(chalk.gray(DefaultCommand.separator));

    // Check if the .orchestr directory exists
    if (!existsSync(path.join(process.cwd(), Utils.BASE_PATH))) {
      Utils.logError(
        'The .orchestr directory does not exist. Make sure to create a script first.'
      );
      process.exit(1);
    }

    // List scripts
    const scripts = this.listScripts();

    // Log scripts
    scripts.forEach(script => {
      console.log(chalk.green.bold(script.data.name));
      if (script.data.description) {
        console.log(chalk.gray(script.data.description));
      }
      console.log('\n');
    });
  }
}
