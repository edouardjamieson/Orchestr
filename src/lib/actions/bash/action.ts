import { execSync } from 'child_process';
import Utils from '../../utils';
import {
  ActionConfig_Bash,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';

const ActionBash = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_Bash;
  const isValid = validate(config);

  if (isValid !== true) {
    return {
      success: false,
      message: `Property "${isValid}" is missing from the action config.`,
    };
  }

  const command = Utils.parseVariableMessage(config.command, options);
  let stdout = '';

  try {
    const result = execSync(command);
    stdout = result.toString();
  } catch (error) {
    return {
      success: false,
      message: `Error executing bash command:\n${error}.`,
    };
  }

  return {
    success: true,
    message: config.silent ? undefined : stdout,
  };
};

export default ActionBash;
