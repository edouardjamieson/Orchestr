import { normalize } from 'path';
import Utils from '../../utils';
import {
  ActionConfig_FileUpdate,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const ActionFileUpdate = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_FileUpdate;
  const isValid = validate(config);

  if (isValid !== true) {
    return {
      success: false,
      message: `Property "${isValid}" is missing from the action config.`,
    };
  }

  const path = normalize(Utils.parseVariableMessage(config.path, options));
  const content = config.content
    ? Utils.parseVariableMessage(config.content, options)
    : '';

  // Check if the file does not exists
  if (!existsSync(path)) {
    return {
      success: false,
      message: `File at ${path} does not exist.`,
    };
  }

  // Get content from file
  const fileContent = readFileSync(path, { encoding: 'utf-8' });

  try {
    writeFileSync(path, `${fileContent}\n${content}`, {
      encoding: 'utf-8',
      flush: config.overwrite,
    });
  } catch (error) {
    return {
      success: false,
      message: `Error updating file at ${path}:\n${error}.`,
    };
  }

  return {
    success: true,
  };
};

export default ActionFileUpdate;
