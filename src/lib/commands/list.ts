import chalk from 'chalk';
import Utils from '../utils';
import DefaultCommand from './commands.service';
import { CommandOptions } from './commands.type';

export class CommandList extends DefaultCommand {
  constructor(props: CommandOptions) {
    super(props);

    // Launch greetings
    Utils.clearConsole();
    console.log(DefaultCommand.title);
    console.log(chalk.gray(DefaultCommand.separator));

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
