import { ActionConfig_FileSelect } from '../types';

export function validate(config: ActionConfig_FileSelect) {
  if (!config.message) {
    return 'message';
  }
  return true;
}
