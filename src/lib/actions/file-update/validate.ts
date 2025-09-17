import { ActionConfig_FileUpdate } from '../types';

export function validate(config: ActionConfig_FileUpdate) {
  if (!config.path) {
    return 'path';
  }
  if (!config.content) {
    return 'content';
  }
  return true;
}
