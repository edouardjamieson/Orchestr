import {
  IfCondition,
  IfConditionCompare,
  IfElseStep,
  ScriptSavedValue,
} from './types';
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
  const [key, compare, value] = condition;
  const checkValue = Utils.parseVariableMessage(key as string, savedValues);

  switch (compare) {
    case IfConditionCompare.EQUAL:
      return checkValue == value;
    case IfConditionCompare.NOT_EQUAL:
      return checkValue != value;
    case IfConditionCompare.GREATER_THAN:
      return isNaN(Number(checkValue)) || isNaN(Number(value))
        ? false
        : Number(checkValue) > Number(value);
    case IfConditionCompare.LESS_THAN:
      return isNaN(Number(checkValue)) || isNaN(Number(value))
        ? false
        : Number(checkValue) < Number(value);
    case IfConditionCompare.GREATER_THAN_OR_EQUAL:
      return isNaN(Number(checkValue)) || isNaN(Number(value))
        ? false
        : Number(checkValue) >= Number(value);
    case IfConditionCompare.LESS_THAN_OR_EQUAL:
      return isNaN(Number(checkValue)) || isNaN(Number(value))
        ? false
        : Number(checkValue) <= Number(value);
    case IfConditionCompare.IN:
      return String(value)
        ?.split(',')
        .includes(checkValue);
    case IfConditionCompare.NOT_IN:
      return !String(value)
        ?.split(',')
        .includes(checkValue);
    case IfConditionCompare.IS_EMPTY:
      return checkValue === '';
    case IfConditionCompare.IS_NOT_EMPTY:
      return checkValue !== '';
    case IfConditionCompare.IS_TRUE:
      return checkValue === 'true' || checkValue === '1';
    case IfConditionCompare.IS_FALSE:
      return checkValue === 'false' || checkValue === '0';
    default:
      return false;
  }
};
