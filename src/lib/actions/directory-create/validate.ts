import { ActionConfig_DirectoryCreate } from '../types';

export function validate(config: ActionConfig_DirectoryCreate) {
  if (!config.path) {
    return 'path';
  }
  return true;
}
