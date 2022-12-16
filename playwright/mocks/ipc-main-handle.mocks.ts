import { Projects, PROJECT_PATHS, PROJECT_PATH_INVALID } from '../constants';

export interface ShowOpenDialogMock {
  canceled: boolean;
  filePaths: string[];
}
export interface ShowMessageBoxMock {
  response: number;
}

export class IPC_MAIN_HANDLE_MOCKS {
  static readonly showOpenDialogChannel = 'test-dialog-showOpenDialog';
  static readonly showOpenDialog: Record<'invalid' | 'canceled', ShowOpenDialogMock> = {
    invalid: {
      canceled: false,
      filePaths: [PROJECT_PATH_INVALID]
    },
    canceled: {
      canceled: true,
      filePaths: []
    }
  };
  static getShowOpenDialogFor(project: Projects): ShowOpenDialogMock {
    return {
      canceled: false,
      filePaths: [PROJECT_PATHS[project]]
    };
  }

  static readonly showMessageBoxChannel = 'test-dialog-showMessageBox';
  static readonly showMessageBox: Record<string, ShowMessageBoxMock> = {
    ok: {
      response: 0
    }
  };

  static readonly openExternalChannel = 'test-shell-openExternal';
}
