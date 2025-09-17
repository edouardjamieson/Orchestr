import { normalize } from 'path';
import Utils from '../../utils';
import {
  ActionConfig_FileRead,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';
import { existsSync, readFileSync } from 'fs';

const ActionFileRead = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_FileRead;
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

  // Get content from file
  const fileContent = readFileSync(path, { encoding: 'utf-8' });

  return {
    success: true,
    message: fileContent,
  };
};

export default ActionFileRead;
