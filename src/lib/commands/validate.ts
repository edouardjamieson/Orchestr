import Utils from '../utils';
import { CommandOptions } from './commands.type';
import chalk from 'chalk';
import { validateActionConfig } from '../actions';
import { ActionConfig } from '../actions/types';
import {
  validateScriptArgs,
  validateScriptSteps,
  validateScriptStructure,
  validateScriptVariables,
} from '../validate';
import DefaultCommand from './commands.service';

export class CommandValidate extends DefaultCommand {
  private savedValuesIds: string[] = [];

  constructor(props: CommandOptions) {
    super(props);

    // Get script
    this.getScript();

    // Launch greetings
    Utils.clearConsole();
    this.logGreetings('validate');

    // Validate script
    const hasErrors = this.validateScript();

    // End
    if (hasErrors) {
      Utils.logError(`\n❌ Script finished validating with errors.`);
      process.exit(1);
    }
    console.log(chalk.green.bold(`\n🎉 Script validated successfully!`));
    process.exit(0);
  }

  private _beginValidationStep(stepTitle: string) {
    console.log(chalk.gray(DefaultCommand.separator));
    console.log(chalk.white.bold(stepTitle));
    console.log(chalk.gray(DefaultCommand.separator));
  }

  private _endValidationStep() {
    console.log('\n');
  }

  private validateScript() {
    // Validate script structure
    const structureHasErrors = this._validateStructure();

    // Validate script args
    const argsHasErrors = this._validateArgs();

    // Validate script variables
    const variablesHasErrors = this._validateVariables();

    // Validate script actions
    const actionsHasErrors = this._validateActions();

    // Validate script steps
    const stepsHasErrors = this._validateSteps();

    // Check if duplicate saved values ids
    const duplicateSavedValuesIdsHasErrors = this._validateDuplicateSavedValuesIds();

    return (
      structureHasErrors ||
      argsHasErrors ||
      variablesHasErrors ||
      actionsHasErrors ||
      stepsHasErrors ||
      duplicateSavedValuesIdsHasErrors
    );
  }

  private _validateStructure() {
    let hasErrors = false;
    this._beginValidationStep('Validating script structure');

    const {
      missingOptionalProperties,
      missingRequiredProperties,
    } = validateScriptStructure(this.script);

    // Missing required properties
    if (missingRequiredProperties.length > 0) {
      const str = `Found ${
        missingRequiredProperties.length
      } missing required properties:\n${missingRequiredProperties
        .map(o => `- ${o}`)
        .join('\n')}`;

      Utils.logError(str);
      hasErrors = true;
    }

    // Missing optional properties
    if (missingOptionalProperties.length > 0) {
      const str = `Found ${
        missingOptionalProperties.length
      } missing optional properties:\n${missingOptionalProperties
        .map(o => `- ${o}`)
        .join('\n')}`;

      Utils.logWarning(str);
    }

    if (missingRequiredProperties.length === 0) {
      Utils.logSuccess('✅ Script structure validated successfully');
    }

    this._endValidationStep();
    return hasErrors;
  }

  private _validateArgs() {
    let hasErrors = false;
    this._beginValidationStep('Validating script args');

    const _validateScriptArgs = validateScriptArgs(this.script);
    if (!_validateScriptArgs.success) {
      Utils.logError(_validateScriptArgs.message as string);
      hasErrors = true;
    } else {
      const args = this.script.args ?? [];
      const hasArgs = args.length > 0;

      const str = hasArgs
        ? `${args
            .map(o => `✅ ${o.id}${o.required ? ' (required)' : ''}`)
            .join('\n')}`
        : '✅ Script has no args';
      Utils.logSuccess(str);
      this.savedValuesIds.push(...(_validateScriptArgs.message as string[]));
    }

    this._endValidationStep();
    return hasErrors;
  }

  private _validateVariables() {
    let hasErrors = false;
    this._beginValidationStep('Validating script variables');

    const _validateScriptVariables = validateScriptVariables(this.script);
    if (!_validateScriptVariables.success) {
      Utils.logError(_validateScriptVariables.message as string);
      hasErrors = true;
    } else {
      const vars = this.script.variables ?? {};
      const hasVariables = Object.keys(vars).length > 0;
      const str = hasVariables
        ? `${Object.keys(vars)
            .map(o => `✅ ${o}`)
            .join('\n')}`
        : '✅ Script has no variables';
      Utils.logSuccess(str);
      this.savedValuesIds.push(
        ...(_validateScriptVariables.message as string[])
      );
    }

    this._endValidationStep();
    return hasErrors;
  }

  private _validateActions() {
    let hasErrors = false;
    this._beginValidationStep('Validating script actions');

    for (let index = 0; index < this.script.actions.length; index++) {
      const action = this.script.actions[index];
      const returnValue = validateActionConfig(
        action.type,
        action.config as ActionConfig
      );

      // ERROR
      if (returnValue !== true) {
        Utils.logError(
          `❌ Error at action "${action.id}":\n${chalk.gray(
            `Property "${returnValue}" is missing from the action config.`
          )}`
        );
        hasErrors = true;
      }

      // SUCCESS
      else Utils.logSuccess(`✅ ${action.id}`);

      this.savedValuesIds.push(action.id);
    }

    this._endValidationStep();
    return hasErrors;
  }

  private _validateSteps() {
    let hasErrors = false;
    this._beginValidationStep('Validating script steps');

    const _validateScriptSteps = validateScriptSteps(this.script);
    if (!_validateScriptSteps.success) {
      Utils.logError(_validateScriptSteps.message as string);
      hasErrors = true;
    } else {
      const steps = this.script.steps ?? [];
      const hasSteps = steps.length > 0;
      const str = hasSteps
        ? `${steps
            .map(o => `✅ ${typeof o === 'string' ? o : JSON.stringify(o)}`)
            .join('\n')}`
        : '✅ Script has no steps';
      Utils.logSuccess(str);
      this.savedValuesIds.push(...(_validateScriptSteps.message as string[]));
    }

    this._endValidationStep();
    return hasErrors;
  }

  private _validateDuplicateSavedValuesIds() {
    let hasErrors = false;
    this._beginValidationStep('Finishing up');

    const duplicateSavedValuesIds = this.savedValuesIds.filter(
      (id, index, self) => self.indexOf(id) !== index
    );
    if (duplicateSavedValuesIds.length > 0) {
      Utils.logError(`Duplicate IDs: ${duplicateSavedValuesIds.join(', ')}`);
      hasErrors = true;
    } else Utils.logSuccess('✅ No duplicate IDs found');

    this._endValidationStep();
    return hasErrors;
  }
}
