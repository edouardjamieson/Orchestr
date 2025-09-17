import { existsSync, mkdirSync } from 'fs';
import Utils from '../../utils';
import {
  ActionConfig_DirectoryCreate,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';
import { normalize } from 'path';

const ActionDirectoryCreate = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_DirectoryCreate;
  const isValid = validate(config);

  if (isValid !== true) {
    return {
      success: false,
      message: `Property "${isValid}" is missing from the action config.`,
    };
  }

  const path = normalize(Utils.parseVariableMessage(config.path, options));

  // Check if the directory already exists
  if (existsSync(path)) {
    return {
      success: false,
      message: `Directory at ${path} already exists.`,
    };
  }

  try {
    mkdirSync(path, { recursive: true, mode: config.mode });
  } catch (error) {
    return {
      success: false,
      message: `Error creating directory at ${path}:\n${error}.`,
    };
  }

  return {
    success: true,
  };
};

export default ActionDirectoryCreate;
