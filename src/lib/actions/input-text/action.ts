import { input, password } from '@inquirer/prompts';
import Utils from '../../utils';
import {
  ActionConfig_InputText,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';

const ActionInputText = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_InputText;
  const isValid = validate(config);

  if (isValid !== true) {
    return {
      success: false,
      message: `Property "${isValid}" is missing from the action config.`,
    };
  }

  let result: string;

  if (config.mask) {
    result = await password({
      message: Utils.parseVariableMessage(config.message, options),
    });
  } else {
    result = await input({
      message: Utils.parseVariableMessage(config.message, options),
      default: config.default,
      required: config.required,
    });
  }

  return {
    success: true,
    message: result,
  };
};

export default ActionInputText;
