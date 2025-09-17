import { confirm } from '@inquirer/prompts';
import Utils from '../../utils';
import {
  ActionConfig_InputConfirm,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';

const ActionInputConfirm = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_InputConfirm;
  const isValid = validate(config);

  if (isValid !== true) {
    return {
      success: false,
      message: `Property "${isValid}" is missing from the action config.`,
    };
  }

  const result = await confirm({
    message: Utils.parseVariableMessage(config.message, options),
  });

  return {
    success: true,
    message: result,
  };
};

export default ActionInputConfirm;
