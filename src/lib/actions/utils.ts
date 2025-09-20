import {
  ActionConfig,
  ActionConfig_FileRead,
  ActionConfig_FileDelete,
  ActionConfig_FileMove,
  ActionConfig_DirectoryCreate,
  ActionConfig_DirectoryDelete,
  ActionConfig_Bash,
  ActionConfig_InputChoice,
  ActionConfig_InputText,
  ActionConfig_Message,
  ActionType,
  ActionConfig_FileUpdate,
  ActionConfig_FileCreate,
  ActionConfig_InputConfirm,
  ActionConfig_FileSelect,
} from './types';

export function getActionConfigType(
  config: ActionConfig,
  actionType: ActionType
) {
  switch (actionType) {
    case ActionType.INPUT_CHOICE:
      return config as ActionConfig_InputChoice;
    case ActionType.INPUT_TEXT:
      return config as ActionConfig_InputText;
    case ActionType.INPUT_CONFIRM:
      return config as ActionConfig_InputConfirm;
    case ActionType.FILE_CREATE:
      return config as ActionConfig_FileCreate;
    case ActionType.FILE_UPDATE:
      return config as ActionConfig_FileUpdate;
    case ActionType.FILE_READ:
      return config as ActionConfig_FileRead;
    case ActionType.FILE_DELETE:
      return config as ActionConfig_FileDelete;
    case ActionType.FILE_MOVE:
      return config as ActionConfig_FileMove;
    case ActionType.FILE_SELECT:
      return config as ActionConfig_FileSelect;
    case ActionType.DIRECTORY_CREATE:
      return config as ActionConfig_DirectoryCreate;
    case ActionType.DIRECTORY_DELETE:
      return config as ActionConfig_DirectoryDelete;
    case ActionType.MESSAGE:
      return config as ActionConfig_Message;
    case ActionType.BASH:
      return config as ActionConfig_Bash;
  }
}
