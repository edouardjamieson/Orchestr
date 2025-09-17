import {
  ActionType,
  ActionConfig_InputChoice,
  ActionConfig_InputText,
  ActionConfig_InputConfirm,
  ActionConfig_FileCreate,
  ActionConfig_FileUpdate,
  ActionConfig_FileRead,
  ActionConfig_FileDelete,
  ActionConfig_FileMove,
  ActionConfig_DirectoryCreate,
  ActionConfig_DirectoryDelete,
  ActionConfig_Message,
  ActionConfig_Bash,
  ActionConfig,
} from './types';
import { validateActionInputChoice } from './input-choice';
import { validateActionInputText } from './input-text';
import { validateActionInputConfirm } from './input-confirm';
import { validateActionFileCreate } from './file-create';
import { validateActionFileUpdate } from './file-update';
import { validateActionFileRead } from './file-read';
import { validateActionFileDelete } from './file-delete';
import { validateActionFileMove } from './file-move';
import { validateActionDirectoryCreate } from './directory-create';
import { validateActionDirectoryDelete } from './directory-delete';
import { validateActionMessage } from './message';
import { validateActionBash } from './bash';

export function validateActionConfig(
  actionType: ActionType,
  config: ActionConfig
): true | string {
  switch (actionType) {
    case ActionType.INPUT_CHOICE:
      return validateActionInputChoice(config as ActionConfig_InputChoice);
    case ActionType.INPUT_TEXT:
      return validateActionInputText(config as ActionConfig_InputText);
    case ActionType.INPUT_CONFIRM:
      return validateActionInputConfirm(config as ActionConfig_InputConfirm);
    case ActionType.FILE_CREATE:
      return validateActionFileCreate(config as ActionConfig_FileCreate);
    case ActionType.FILE_UPDATE:
      return validateActionFileUpdate(config as ActionConfig_FileUpdate);
    case ActionType.FILE_READ:
      return validateActionFileRead(config as ActionConfig_FileRead);
    case ActionType.FILE_DELETE:
      return validateActionFileDelete(config as ActionConfig_FileDelete);
    case ActionType.FILE_MOVE:
      return validateActionFileMove(config as ActionConfig_FileMove);
    case ActionType.DIRECTORY_CREATE:
      return validateActionDirectoryCreate(
        config as ActionConfig_DirectoryCreate
      );
    case ActionType.DIRECTORY_DELETE:
      return validateActionDirectoryDelete(
        config as ActionConfig_DirectoryDelete
      );
    case ActionType.MESSAGE:
      return validateActionMessage(config as ActionConfig_Message);
    case ActionType.BASH:
      return validateActionBash(config as ActionConfig_Bash);
    default:
      return `Unknown action type: ${actionType}`;
  }
}
