import { ActionConfig_DirectoryDelete } from '../types';

export function validate(config: ActionConfig_DirectoryDelete) {
  if (!config.path) {
    return 'path';
  }
  return true;
}
