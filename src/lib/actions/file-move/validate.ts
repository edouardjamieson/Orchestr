import { ActionConfig_FileMove } from '../types';

export function validate(config: ActionConfig_FileMove) {
  if (!config.path) {
    return 'path';
  }
  if (!config.destination) {
    return 'destination';
  }
  return true;
}
