import { normalize } from 'path';
import Utils from '../../utils';
import {
  ActionConfig_FileDelete,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';
import { existsSync, unlinkSync } from 'fs';

const ActionFileDelete = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_FileDelete;
  const isValid = validate(config);

  if (isValid !== true) {
    return {
      success: false,
      message: `Property "${isValid}" is missing from the action config.`,
    };
  }

  const path = normalize(Utils.parseVariableMessage(config.path, options));

  // Check if the file does not exists
  if (!existsSync(path)) {
    return {
      success: false,
      message: `File at ${path} does not exist.`,
    };
  }

  try {
    unlinkSync(path);
  } catch (error) {
    return {
      success: false,
      message: `Error deleting file at ${path}:\n${error}.`,
    };
  }

  return {
    success: true,
  };
};

export default ActionFileDelete;
