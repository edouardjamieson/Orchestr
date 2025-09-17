import { ActionConfig_FileRead } from '../types';

export function validate(config: ActionConfig_FileRead) {
  if (!config.path) {
    return 'path';
  }
  return true;
}
