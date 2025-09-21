import chalk from 'chalk';
import DefaultCommand from './commands.service';
import { CommandOptions } from './commands.type';
import Utils from '../utils';
import { confirm, input } from '@inquirer/prompts';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { Argument, Script, Variable } from '../types';

export class CommandInit extends DefaultCommand {
  private newScriptName: string = '';
  private newScriptSlug: string = '';
  private newScriptDescription: string = '';
  private newScriptArgs: Argument[] = [];
  private newScriptVariables: Variable = {};

  constructor(props: CommandOptions) {
    super(props);

    // Launch greetings
    Utils.clearConsole();
    console.log(DefaultCommand.title);
    console.log(chalk.gray(DefaultCommand.separator));

    // Init script
    this.initScript();
  }

  private async initScript() {
    // Maybe create main directory
    this._maybeCreateMainDir();

    // Ask for script name
    await this._askScriptName();

    // Ask for script description
    await this._askScriptDescription();

    // Ask for script args
    await this._askScriptArgs();

    // Ask for script variables
    await this._askScriptVariables();

    // Create script
    this._createScript();

    // Success message
    console.log(chalk.green('Script created successfully!'));
    console.log(
      chalk.gray(
        `Script created at ${path.join(
          process.cwd(),
          Utils.BASE_PATH,
          `${this.newScriptSlug}.json`
        )}`
      )
    );
  }

  private _maybeCreateMainDir() {
    if (!existsSync(path.join(process.cwd(), Utils.BASE_PATH))) {
      mkdirSync(Utils.BASE_PATH, { recursive: true });
    }
  }

  private async _askScriptName() {
    this.newScriptName = await input({
      message: 'Enter the script name:',
      required: true,
      validate: (value: string) => {
        if (value.length === 0) {
          return 'Script name is required';
        }

        const slug = Utils.slugify(value);
        const _path = path.join(process.cwd(), Utils.BASE_PATH, `${slug}.json`);

        // Check if script name is already taken
        if (existsSync(_path)) {
          return 'A script with this name already exists';
        }

        return true;
      },
    });

    this.newScriptSlug = Utils.slugify(this.newScriptName);
  }

  private async _askScriptDescription() {
    this.newScriptDescription = await input({
      message: 'Enter the script description:',
    });
  }

  private async _askScriptArgs() {
    const shouldAddArgs = await confirm({
      message: 'Do you want to add arguments?',
    });

    if (!shouldAddArgs) return;

    await this._addScriptArg();
  }

  private async _addScriptArg() {
    const argName = await input({
      message: 'Argument name:',
      validate: (value: string) => {
        if (Utils.slugify(value) != value) {
          return 'Argument name must be in snake_case and cannot contain special characters.';
        }
        if (this.newScriptArgs.some(arg => arg.id === value)) {
          return 'Argument name must be unique.';
        }
        return true;
      },
      required: true,
    });

    const argRequired = await confirm({
      message: 'Is this argument required?',
      default: true,
    });

    this.newScriptArgs.push({
      id: argName,
      required: argRequired,
    });

    const shouldAddAnotherArg = await confirm({
      message: 'Do you want to add another argument?',
      default: false,
    });

    if (shouldAddAnotherArg) {
      await this._addScriptArg();
    }
  }

  private async _askScriptVariables() {
    const shouldAddVariables = await confirm({
      message: 'Do you want to add variables?',
    });

    if (!shouldAddVariables) return;

    await this._addScriptVariable();
  }

  private async _addScriptVariable() {
    const variableName = await input({
      message: 'Variable name:',
      validate: (value: string) => {
        if (Utils.slugify(value) != value) {
          return 'Variable name must be in snake_case and cannot contain special characters.';
        }
        if (Object.keys(this.newScriptVariables).includes(value)) {
          return 'Variable name must be unique.';
        }
        return true;
      },
      required: true,
    });

    const variableValue = await input({
      message: 'Variable value:',
      required: true,
    });

    this.newScriptVariables[variableName] = variableValue;

    const shouldAddAnotherVariable = await confirm({
      message: 'Do you want to add another variable?',
      default: false,
    });

    if (shouldAddAnotherVariable) {
      await this._addScriptVariable();
    }
  }

  private _createScript() {
    const script: Script = {
      name: this.newScriptName,
      description:
        this.newScriptDescription.length > 0
          ? this.newScriptDescription
          : undefined,
      args: this.newScriptArgs.length > 0 ? this.newScriptArgs : undefined,
      variables:
        Object.keys(this.newScriptVariables).length > 0
          ? this.newScriptVariables
          : undefined,
      actions: [],
      steps: [],
    };

    const scriptJson = JSON.stringify(script, null, 2);

    writeFileSync(
      path.join(process.cwd(), Utils.BASE_PATH, `${this.newScriptSlug}.json`),
      scriptJson
    );
  }
}
