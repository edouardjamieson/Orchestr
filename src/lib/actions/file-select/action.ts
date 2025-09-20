import { search } from '@inquirer/prompts';
import {
  ActionConfig_FileSelect,
  ActionFunctionProps,
  ActionFunctionReturn,
} from '../types';
import { validate } from './validate';
import Utils from '../../utils';

const ActionFileSelect = async (
  props: ActionFunctionProps
): Promise<ActionFunctionReturn> => {
  const { action, options } = props;
  const config = action.config as ActionConfig_FileSelect;
  const isValid = validate(config);

  if (isValid !== true) {
    return {
      success: false,
      message: `Property "${isValid}" is missing from the action config.`,
    };
  }

  const cwd = process.cwd();

  const result = await search({
    message: Utils.parseVariableMessage(config.message, options),
    source: term => {
      const allFiles = Utils.scanDirectory(
        process.cwd(),
        term ?? '',
        config.includeDirs ?? false
      );

      return allFiles.map(({ path, isFile }) => {
        return {
          name: `${isFile ? '📄' : '📁'} .${path.replace(cwd, '')}`,
          value: path,
        };
      });
    },
  });

  return {
    success: true,
    message: result,
  };
};

export default ActionFileSelect;
