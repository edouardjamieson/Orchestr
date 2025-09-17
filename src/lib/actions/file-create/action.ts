import { existsSync, writeFileSync } from 'fs';
import Utils from '../../utils';
import {
  ActionConfig_FileCreate,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';
import { normalize } from 'path';

const ActionFileCreate = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_FileCreate;
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

  // Check if the file already exists
  if (existsSync(path)) {
    return {
      success: false,
      message: `File at ${path} already exists.`,
    };
  }

  try {
    writeFileSync(path, content, { encoding: 'utf-8' });
  } catch (error) {
    return {
      success: false,
      message: `Error creating file at ${path}:\n${error}.`,
    };
  }

  return {
    success: true,
  };
};

export default ActionFileCreate;
