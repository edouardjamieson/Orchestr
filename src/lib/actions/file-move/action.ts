import { existsSync, renameSync } from 'fs';
import Utils from '../../utils';
import {
  ActionConfig_FileMove,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';
import { normalize } from 'path';

const ActionFileMove = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_FileMove;
  const isValid = validate(config);

  if (isValid !== true) {
    return {
      success: false,
      message: `Property "${isValid}" is missing from the action config.`,
    };
  }

  const path = normalize(Utils.parseVariableMessage(config.path, options));
  const destination = normalize(
    Utils.parseVariableMessage(config.destination, options)
  );

  // Check if the file does not exists
  if (!existsSync(path)) {
    return {
      success: false,
      message: `File at ${path} does not exist.`,
    };
  }

  try {
    renameSync(path, destination);
  } catch (error) {
    return {
      success: false,
      message: `Error moving file at ${path}:\n${error}.`,
    };
  }

  return {
    success: true,
  };
};

export default ActionFileMove;
