import path from 'path';
import { Script, ScriptSavedValue } from '../types';
import Utils from '../utils';
import { CommandOptions } from './commands.type';
import { existsSync, readFileSync } from 'fs';
import chalk from 'chalk';

export default class DefaultCommand {
  static separator = '----------------------------------------';

  public scriptName!: string;
  public script!: Script;
  public savedValues: ScriptSavedValue[] = [];

  public ignoreArgs: boolean = false;

  constructor(props: CommandOptions) {
    const { cmdArgs, ignoreArgs } = props;

    // Get script name
    if (cmdArgs.length === 0) {
      Utils.logError('Make sure to provide a script name.');
      process.exit(1);
    }
    this.scriptName = cmdArgs[0];

    // Additional properties
    this.ignoreArgs = ignoreArgs ?? false;

    // Parse command options
    // Save command args as action return values, for later usage
    if (!this.ignoreArgs) {
      this.savedValues = cmdArgs
        .filter(arg => arg.startsWith('--'))
        .map(o => ({
          id: o.split('=')[0].replace('--', ''),
          value: o.split('=')[1],
        }));
    }
  }

  public getScript() {
    const scriptPath = path.join(
      process.cwd(),
      Utils.BASE_PATH,
      `${this.scriptName}.json`
    );

    // Check if script file exists
    if (!existsSync(scriptPath)) {
      Utils.logError(
        `We could not find the script file for ${this.scriptName}. Make sure it exists before launching scripts.`
      );
      process.exit(1);
    }

    // Read the script file
    const scriptData = readFileSync(scriptPath, 'utf8');
    try {
      // Parse script file
      this.script = JSON.parse(scriptData) as Script;
    } catch {
      Utils.logError(
        `We could not parse the script file for ${this.scriptName}. Make sure it is a valid JSON file.`
      );
      process.exit(1);
    }

    // Make sure all required script args are provided
    if (!this.ignoreArgs) {
      const requiredArgs = (this.script.args ?? []).filter(arg => arg.required);
      const missingArgs = requiredArgs.filter(
        arg => !this.savedValues.find(o => o.id === arg.id)
      );

      if (missingArgs.length > 0) {
        Utils.logError(
          `Missing required arguments : ${missingArgs
            .map(arg => arg.id)
            .join(', ')}`
        );
        process.exit(1);
      }
    }
  }

  public logGreetings(type: 'run' | 'validate') {
    console.log(chalk.blue.bold(`🎭 Orchestr`));

    if (type === 'run') {
      console.log(chalk.green(`Running: ${this.script.name}`));
    } else {
      console.log(chalk.yellow(`Validating: ${this.script.name}`));
    }

    if (this.script.description) {
      console.log(chalk.gray(`${this.script.description}\n`));
    }

    console.log(chalk.gray(DefaultCommand.separator));
  }
}
