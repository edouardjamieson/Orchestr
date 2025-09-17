import { IfCondition, IfElseStep, ScriptSavedValue } from './types';
import Utils from './utils';

export function validateIfElseStep(
  step: IfElseStep,
  savedValues: ScriptSavedValue[]
) {
  let valid = true;

  // If if is an array of arrays of strings
  if (Array.isArray(step.if[0])) {
    for (let index = 0; index < step.if.length; index++) {
      const element = step.if[index] as IfCondition;
      const condValid = validateIfCondition(element, savedValues);
      if (!condValid) {
        valid = false;
        break;
      }
    }
  } else {
    valid = validateIfCondition(step.if as IfCondition, savedValues);
  }

  return valid;
}

const validateIfCondition = (
  condition: IfCondition,
  savedValues: ScriptSavedValue[]
) => {
  const key = condition[0];
  const compare = condition[1];
  const value = condition[2];

  const checkValue = Utils.parseVariableMessage(key as string, savedValues);

  switch (compare) {
    case '==':
      return checkValue == value;
    case '!=':
      return checkValue != value;
    case '>':
      return isNaN(Number(checkValue)) || isNaN(Number(value))
        ? false
        : Number(checkValue) > Number(value);
    case '<':
      return isNaN(Number(checkValue)) || isNaN(Number(value))
        ? false
        : Number(checkValue) < Number(value);
    case '>=':
      return isNaN(Number(checkValue)) || isNaN(Number(value))
        ? false
        : Number(checkValue) >= Number(value);
    case '<=':
      return isNaN(Number(checkValue)) || isNaN(Number(value))
        ? false
        : Number(checkValue) <= Number(value);
    case 'in':
      return String(value)
        ?.split(',')
        .includes(checkValue);
    case 'not-in':
      return !String(value)
        ?.split(',')
        .includes(checkValue);
    case 'is-empty':
      return checkValue === '';
    case 'is-not-empty':
      return checkValue !== '';
    case 'is-true':
      return checkValue === 'true' || checkValue === '1';
    case 'is-false':
      return checkValue === 'false' || checkValue === '0';
    default:
      return false;
  }
};
