import { ActionConfig_InputChoice } from '../types';

export function validate(config: ActionConfig_InputChoice) {
  if (!config.choices) {
    return 'choices';
  }
  if (
    typeof config.choices !== 'object' ||
    Object.keys(config.choices).length === 0
  ) {
    return 'choices';
  }

  if (!config.message) {
    return 'message';
  }
  return true;
}
