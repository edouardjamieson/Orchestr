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
  then: string;
  else?: string;
}

export type IfConditionCompare =
  | '=='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<='
  | 'in'
  | 'not-in'
  | 'is-empty'
  | 'is-not-empty'
  | 'is-true'
  | 'is-false';

export type IfCondition = [string, IfConditionCompare, any];

export interface ScriptSavedValue {
  id: string;
  value: any;
}

export interface ScriptValidationResult {
  success: boolean;
  message: any;
}
