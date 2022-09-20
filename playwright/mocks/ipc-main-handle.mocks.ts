import {
  PROJECT_INVALID,
  PROJECT_NEW,
  PROJECT_OFFICE_HVAC
} from './projects.mocks';

export interface ShowOpenDialogMock {
  canceled: boolean;
  filePaths: string[];
}
export interface ShowMessageBoxMock {
  response: number;
}

export class IPC_MAIN_HANDLE_MOCKS {
  static readonly showOpenDialogChannel = 'test-dialog-showOpenDialog';
  static readonly showOpenDialog: Record<string, ShowOpenDialogMock> = {
    validNew: {
      canceled: false,
      filePaths: [PROJECT_NEW.path]
    },
    validOfficeHVAC: {
      canceled: false,
      filePaths: [PROJECT_OFFICE_HVAC.path]
    },
    invalid: {
      canceled: false,
      filePaths: [PROJECT_INVALID.path]
    },
    canceled: {
      canceled: true,
      filePaths: []
    }
  };

  static readonly showMessageBoxChannel = 'test-dialog-showMessageBox';
  static readonly showMessageBox: Record<string, ShowMessageBoxMock> = {
    ok: {
      response: 0
    }
  };
}
