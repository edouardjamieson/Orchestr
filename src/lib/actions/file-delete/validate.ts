import { ActionConfig_FileDelete } from '../types';

export function validate(config: ActionConfig_FileDelete) {
  if (!config.path) {
    return 'path';
  }
  return true;
}
