import { ActionConfig_Message } from '../types';

export function validate(config: ActionConfig_Message) {
  if (!config.message) {
    return 'message';
  }
  return true;
}
