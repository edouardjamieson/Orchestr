import chalk from 'chalk';
import { existsSync } from 'fs';
import path from 'path';

export default class Utils {
  static BASE_PATH = '.orchestr';

  static validateStructure() {
    const _path = path.join(process.cwd(), this.BASE_PATH);
    if (!existsSync(_path)) {
      this.logError(
        `We could not find the ${this.BASE_PATH} directory. Make sure it exists before launching scripts.`
      );
      process.exit(1);
    }
    return true;
  }

  static logError(message: string) {
    console.log(chalk.red.bold(message));
  }

  static logWarning(message: string) {
    console.log(chalk.yellow.bold(message));
  }

  static logSuccess(message: string) {
    console.log(chalk.green.bold(message));
  }

  static clearConsole() {
    const lines = process.stdout.getWindowSize()[1];
    for (var i = 0; i < lines; i++) {
      console.log('\r\n');
    }
  }

  static parseVariableMessage(
    message: string,
    options: { id: string; value: string }[]
  ) {
    return message.replace(/{{(.*?)}}/g, (match, p1) => {
      const value = options.find(o => o.id === p1)?.value;
      if (value === undefined) {
        return match;
      }
      return value;
    });
  }
}
