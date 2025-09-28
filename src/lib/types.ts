import { Action } from './actions/types';

export interface Script {
  name: string;
  description?: string;
  args?: Argument[];
  variables?: Variable;
  actions: Action[];
  steps: Step[];
}

export interface Argument {
  id: string;
  required?: boolean;
}

export type Variable = Record<string, string>;

export type Step = string | IfElseStep;

export interface IfElseStep {
  if: IfCondition | IfCondition[];
  then: string | string[];
  else?: string | string[];
}

export enum IfConditionCompare {
  EQUAL = '==',
  NOT_EQUAL = '!=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN_OR_EQUAL = '<=',
  IN = 'in',
  NOT_IN = 'not-in',
  IS_EMPTY = 'is-empty',
  IS_NOT_EMPTY = 'is-not-empty',
  IS_TRUE = 'is-true',
  IS_FALSE = 'is-false',
}
// | '=='
// | '!='
// | '>'
// | '<'
// | '>='
// | '<='
// | 'in'
// | 'not-in'
// | 'is-empty'
// | 'is-not-empty'
// | 'is-true'
// | 'is-false';

export type IfCondition = [string, IfConditionCompare, string];

export interface ScriptSavedValue {
  id: string;
  value: any;
}

export interface ScriptValidationResult {
  success: boolean;
  message: any;
}
