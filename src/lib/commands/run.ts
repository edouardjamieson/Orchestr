import { IfElseStep, Step } from '../types';
import Utils from '../utils';
import { CommandOptions } from './commands.type';
import chalk from 'chalk';
import {
  Action,
  ActionFunctionProps,
  ActionFunctionReturn,
  ActionType,
} from '../actions/types';
import { validateIfElseStep } from '../conditions';
import {
  ActionMessage,
  ActionInputChoice,
  ActionInputText,
  ActionInputConfirm,
  ActionFileCreate,
  ActionFileRead,
  ActionFileUpdate,
  ActionFileDelete,
  ActionFileMove,
  ActionDirectoryCreate,
  ActionDirectoryDelete,
  ActionBash,
  ActionFileSelect,
} from '../actions';
import DefaultCommand from './commands.service';
import { validateScriptStructure } from '../validate';

export class CommandRun extends DefaultCommand {
  private nextStepOverride = '__continue';
  private endStepOverride = '__end';

  constructor(props: CommandOptions) {
    super(props);

    // Get script
    this.getScript();

    // Validate script
    this.validate();

    // Add script variables to saved values
    const scriptVariables = Object.keys(this.script.variables ?? {}).map(o => ({
      id: o,
      value: this.script.variables?.[o],
    }));
    this.savedValues = [...this.savedValues, ...scriptVariables];

    // Launch greetings
    Utils.clearConsole();
    this.logGreetings('run');

    // Launch actions
    this.runSteps().then(() => {
      this.end();
    });
  }

  private async validate() {
    // Validate script
    const { missingRequiredProperties } = validateScriptStructure(this.script);

    if (missingRequiredProperties.length > 0) {
      Utils.logError(
        `Missing required properties: ${missingRequiredProperties.join(', ')}`
      );
      process.exit(1);
    }
  }

  private async runSteps() {
    const steps = this.script.steps ?? [];

    for (let index = 0; index < steps.length; index++) {
      const step = steps[index];

      await this._runStep(step, index);
    }
  }

  private async _runStep(step: Step, index: number) {
    const actionsToRun: (Action | '__end' | '__continue')[] = [];

    // If string (single action)
    if (typeof step === 'string') {
      if (step === this.nextStepOverride) {
        actionsToRun.push('__continue');
      }
      if (step === this.endStepOverride) {
        actionsToRun.push('__end');
      }

      // Find action
      const action = await this._findAction(step);
      if (!action) {
        Utils.logError(
          `Action with ID "${step}" not found at step with index ${index}`
        );
        process.exit(1);
      }

      actionsToRun.push(action);
    }

    // If object (condition)
    if (typeof step === 'object') {
      // Validate condition
      const valid = validateIfElseStep(step as IfElseStep, this.savedValues);
      console.log(valid);

      // If condition is valid, run "then" action
      if (valid) {
        const actionIds =
          typeof step.then === 'string' ? [step.then] : step.then;
        await Promise.all(
          actionIds.map(async id => {
            if (id === this.nextStepOverride) {
              actionsToRun.push('__continue');
            }
            if (id === this.endStepOverride) {
              actionsToRun.push('__end');
            }
            const action = await this._findAction(id);
            if (!action) {
              Utils.logError(
                `Action with ID "${id}" not found at step with index ${index}`
              );
              process.exit(1);
            }
            actionsToRun.push(action);
          })
        );
      }

      // If condition is not valid, run "else" action
      else {
        if (!step.else) return;
        if (step.else === this.nextStepOverride) {
          actionsToRun.push('__continue');
        }
        if (step.else === this.endStepOverride) {
          actionsToRun.push('__end');
        }
        const actionIds =
          typeof step.else === 'string' ? [step.else] : step.else;
        await Promise.all(
          actionIds.map(async id => {
            const action = await this._findAction(id);
            if (!action) {
              Utils.logError(
                `Action with ID "${id}" not found at step with index ${index}`
              );
              process.exit(1);
            }
            actionsToRun.push(action);
          })
        );
      }
    }

    // Run actions
    for (let z = 0; z < actionsToRun.length; z++) {
      const _action = actionsToRun[z];

      if (_action === this.nextStepOverride) {
        return;
      }
      if (_action === this.endStepOverride) {
        this.end();
      }

      let returnValue: ActionFunctionReturn | undefined = undefined;
      let actionId: string | undefined = undefined;
      const actionToRun = _action as Action;

      const result = await this._runAction(actionToRun);
      if (!result) return;

      returnValue = result;
      actionId = actionToRun.id;

      if (returnValue && actionId) {
        this.savedValues.push({
          id: actionId,
          value: returnValue.message ?? true,
        });
      }
    }
  }

  private async _findAction(actionId: String) {
    const actions = this.script.actions ?? [];
    return actions.find(action => action.id === actionId);
  }

  private async _runAction(action: Action) {
    const defaultProps: ActionFunctionProps = {
      action,
      options: this.savedValues,
    };

    let returnValue: ActionFunctionReturn;

    // Run action
    switch (action.type) {
      case ActionType.INPUT_CHOICE:
        returnValue = await ActionInputChoice(defaultProps);
        break;
      case ActionType.INPUT_TEXT:
        returnValue = await ActionInputText(defaultProps);
        break;
      case ActionType.INPUT_CONFIRM:
        returnValue = await ActionInputConfirm(defaultProps);
        break;
      case ActionType.FILE_CREATE:
        returnValue = await ActionFileCreate(defaultProps);
        break;
      case ActionType.FILE_UPDATE:
        returnValue = await ActionFileUpdate(defaultProps);
        break;
      case ActionType.FILE_READ:
        returnValue = await ActionFileRead(defaultProps);
        break;
      case ActionType.FILE_DELETE:
        returnValue = await ActionFileDelete(defaultProps);
        break;
      case ActionType.FILE_MOVE:
        returnValue = await ActionFileMove(defaultProps);
        break;
      case ActionType.FILE_SELECT:
        returnValue = await ActionFileSelect(defaultProps);
        break;
      case ActionType.DIRECTORY_CREATE:
        returnValue = await ActionDirectoryCreate(defaultProps);
        break;
      case ActionType.DIRECTORY_DELETE:
        returnValue = await ActionDirectoryDelete(defaultProps);
        break;
      case ActionType.BASH:
        returnValue = await ActionBash(defaultProps);
        break;
      case ActionType.MESSAGE:
        returnValue = await ActionMessage(defaultProps);
        break;

      default:
        return false;
    }

    return returnValue;
  }

  private end() {
    console.log(chalk.green.bold(`\n🎉 Script completed successfully!`));
    process.exit(0);
  }
}
