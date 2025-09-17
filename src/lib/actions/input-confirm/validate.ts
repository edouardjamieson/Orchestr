import { ActionConfig_InputConfirm } from '../types';

export function validate(config: ActionConfig_InputConfirm) {
  if (!config.message) {
    return 'message';
  }
  return true;
}
