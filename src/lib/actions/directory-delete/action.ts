import { normalize } from 'path';
import Utils from '../../utils';
import {
  ActionConfig_DirectoryDelete,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';
import { existsSync, rmSync } from 'fs';

const ActionDirectoryDelete = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_DirectoryDelete;
  const isValid = validate(config);

  if (isValid !== true) {
    return {
      success: false,
      message: `Property "${isValid}" is missing from the action config.`,
    };
  }

  const path = normalize(Utils.parseVariableMessage(config.path, options));

  // Check if the directory does not exists
  if (!existsSync(path)) {
    return {
      success: false,
      message: `Directory at ${path} does not exist.`,
    };
  }

  try {
    rmSync(path, { recursive: true });
  } catch (error) {
    return {
      success: false,
      message: `Error deleting directory at ${path}:\n${error}.`,
    };
  }

  return {
    success: true,
  };
};

export default ActionDirectoryDelete;
