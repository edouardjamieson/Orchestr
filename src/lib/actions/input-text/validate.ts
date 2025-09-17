import { ActionConfig_InputText } from '../types';

export function validate(config: ActionConfig_InputText) {
  if (!config.message) {
    return 'message';
  }

  return true;
}
