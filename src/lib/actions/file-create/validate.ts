import { ActionConfig_FileCreate } from '../types';

export function validate(config: ActionConfig_FileCreate) {
  if (!config.path) {
    return 'path';
  }
  return true;
}
