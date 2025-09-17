import { checkbox, select } from '@inquirer/prompts';
import {
  ActionConfig_InputChoice,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';
import Utils from '../../utils';

const ActionInputChoice = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_InputChoice;
  const isValid = validate(config);

  if (isValid !== true) {
    return {
      success: false,
      message: `Property "${isValid}" is missing from the action config.`,
    };
  }

  const choices = Object.keys(config.choices).map(c => ({
    value: c,
    name: Utils.parseVariableMessage(config.choices[c], options),
  }));

  let result: string[] | string;

  if (config.multiple) {
    result = await checkbox({
      message: config.message,
      choices,
    });
  } else {
    result = await select({
      message: config.message,
      choices,
    });
  }

  return {
    success: true,
    message: typeof result === 'string' ? result : result.join(','),
  };
};

export default ActionInputChoice;
