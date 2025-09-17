import Utils from '../../utils';
import {
  ActionConfig_Message,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';

const ActionMessage = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_Message;
  const isValid = validate(config);

  if (isValid !== true) {
    return {
      success: false,
      message: `Property "${isValid}" is missing from the action config.`,
    };
  }

  console.log(Utils.parseVariableMessage(config.message, options));

  return {
    success: true,
  };
};

export default ActionMessage;
