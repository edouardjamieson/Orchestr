import { ActionConfig_Bash } from '../types';

export function validate(config: ActionConfig_Bash) {
  if (!config.command) {
    return 'command';
  }
  return true;
}
