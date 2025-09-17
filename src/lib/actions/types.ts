export interface ActionFunctionProps {
  action: Action;
  options: { id: string; value: any }[];
}

export interface ActionFunctionReturn {
  success: boolean;
  message?: any;
}

export enum ActionType {
  // INPUTS
  INPUT_CHOICE = 'input-choice',
  INPUT_TEXT = 'input-text',
  INPUT_CONFIRM = 'input-confirm',

  // FILES
  FILE_CREATE = 'file-create',
  FILE_UPDATE = 'file-update',
  FILE_READ = 'file-read',
  FILE_DELETE = 'file-delete',
  FILE_MOVE = 'file-move',

  // DIRECTORIES
  DIRECTORY_CREATE = 'directory-create',
  DIRECTORY_DELETE = 'directory-delete',

  // OPERATIONS
  MESSAGE = 'message',
  BASH = 'bash',
}

export interface Action {
  id: string;
  type: ActionType;
  description?: string;
  config?: ActionConfig;
}

export type ActionConfig =
  | ActionConfig_InputChoice
  | ActionConfig_InputText
  | ActionConfig_InputConfirm
  | ActionConfig_FileCreate
  | ActionConfig_FileUpdate
  | ActionConfig_FileRead
  | ActionConfig_FileDelete
  | ActionConfig_FileMove
  | ActionConfig_DirectoryCreate
  | ActionConfig_DirectoryDelete
  | ActionConfig_Message
  | ActionConfig_Bash;

export interface ActionCondition {
  on: string;
  compare:
    | '='
    | '!='
    | '>'
    | '<'
    | '>='
    | '<='
    | 'in'
    | 'not-in'
    | 'empty'
    | 'not-empty'
    | 'true'
    | 'false';
  value?: string;
}

export interface ActionConfig_InputChoice {
  multiple?: boolean;
  required?: boolean;
  message: string;
  choices: Record<string, string>;
}

export interface ActionConfig_InputText {
  message: string;
  required?: boolean;
  default?: string;
  mask?: boolean;
}

export interface ActionConfig_InputConfirm {
  message: string;
}

export interface ActionConfig_FileCreate {
  path: string;
  content?: string;
  mode?: string;
}

export interface ActionConfig_FileUpdate {
  path: string;
  content: string;
  mode?: string;
  overwrite?: boolean;
}

export interface ActionConfig_FileRead {
  path: string;
}

export interface ActionConfig_FileDelete {
  path: string;
}

export interface ActionConfig_FileMove {
  path: string;
  destination: string;
}

export interface ActionConfig_DirectoryCreate {
  path: string;
  mode?: string;
}

export interface ActionConfig_DirectoryDelete {
  path: string;
}

export interface ActionConfig_Message {
  message: string;
}

export interface ActionConfig_Bash {
  command: string;
  silent?: boolean;
}
