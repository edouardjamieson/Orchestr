import { Script, ScriptValidationResult } from './types';

export function validateScriptStructure(script: Script) {
  const missingRequiredProperties = [];
  const missingOptionalProperties = [];

  // Name (required)
  if (!script.name) {
    missingRequiredProperties.push('name');
  }

  // Description (optional)
  if (!script.description || typeof script.description !== 'string') {
    missingOptionalProperties.push('description');
  }

  // Args (optional)
  if (script.args && !Array.isArray(script.args)) {
    missingOptionalProperties.push('args');
  }

  // Variables (optional)
  if (script.variables && typeof script.variables !== 'object') {
    missingOptionalProperties.push('variables');
  }

  // Actions (required)
  if (!script.actions) {
    missingRequiredProperties.push('actions');
  }

  // Steps (required)
  if (!script.steps) {
    missingRequiredProperties.push('steps');
  }

  return {
    missingRequiredProperties,
    missingOptionalProperties,
  };
}

export function validateScriptArgs(script: Script) {
  const result: ScriptValidationResult = {
    success: true,
    message: null,
  };

  // If no args, return true
  if (!script.args) {
    result.message = [] as string[];
    return result;
  }

  // If args is not an array, return false
  if (!Array.isArray(script.args)) {
    result.message = 'Property "args" is not an array';
    result.success = false;
    return result;
  }

  const argIds: string[] = [];

  for (let index = 0; index < script.args.length; index++) {
    const element = script.args[index];

    // If arg is not an object, return false
    if (typeof element !== 'object') {
      result.message = `Argument ${JSON.stringify(
        element
      )} is not a valid JSON object`;
      result.success = false;
      return result;
    }

    // If arg is an object, return true
    if (typeof element.id !== 'string') {
      result.message = `Property "id" is not a string or missing in argument ${JSON.stringify(
        element
      )}`;
      result.success = false;
      return result;
    }

    // If arg id is already in the array, return false
    if (argIds.includes(element.id)) {
      result.message = `Argument with ID "${element.id}" is already defined`;
      result.success = false;
      return result;
    }

    argIds.push(element.id);
  }

  result.message = argIds;
  return result;
}

export function validateScriptVariables(script: Script) {
  const result: ScriptValidationResult = {
    success: true,
    message: null,
  };

  // If no variables, return true
  if (!script.variables) {
    result.message = [] as string[];
    return result;
  }

  // If variables is not an object, return false
  if (typeof script.variables !== 'object') {
    result.message = 'Property "variables" is not an object';
    result.success = false;
    return result;
  }

  const variableIds: string[] = [];

  for (let index = 0; index < Object.keys(script.variables).length; index++) {
    const element = Object.keys(script.variables)[index];

    // If variable id is already in the array, return false
    if (variableIds.includes(element)) {
      result.message = `Variable with ID "${element}" is already defined`;
      result.success = false;
      return result;
    }

    variableIds.push(element);
  }

  result.message = variableIds;
  return result;
}

export function validateScriptSteps(script: Script) {
  const result: ScriptValidationResult = {
    success: true,
    message: null,
  };

  // If no steps, return true
  if (!script.steps) {
    result.message = [] as string[];
    return result;
  }

  // If steps is not an array, return false
  if (!Array.isArray(script.steps)) {
    result.message = 'Property "steps" is not an array';
    result.success = false;
    return result;
  }

  for (let index = 0; index < script.steps.length; index++) {
    const step = script.steps[index];

    // If step is an empty string, return false
    if (step === '') {
      result.message = 'Step is an empty string';
      result.success = false;
      return result;
    }

    // If step is an IfElseStep
    if (typeof step === 'object') {
      // Missing IF
      if (!step.if) {
        result.message = `Property "if" is missing in step at index ${index}`;
        result.success = false;
        return result;
      }

      // Wrong IF
      if (typeof step.if !== 'string' && !Array.isArray(step.if)) {
        result.message = `Property "if" is not a string or an array or strings at index ${index}`;
        result.success = false;
        return result;
      }

      // Missing THEN
      if (!step.then) {
        result.message = `Property "then" is missing in step at index ${index}`;
        result.success = false;
        return result;
      }

      // Wrong THEN
      if (step.then === '') {
        result.message = `Property "then" is an empty string in step at index ${index}`;
        result.success = false;
        return result;
      }

      // Wrong ELSE
      if (step.else === '') {
        result.message = `Property "else" is an empty string in step at index ${index}`;
        result.success = false;
        return result;
      }
    }

    // If step is not a string, return false
    // if (typeof element !== 'string') {
    //   result.message = 'Property "steps" is not an array';
    //   result.success = false;
    //   return result;
    // }
  }

  return result;
}
