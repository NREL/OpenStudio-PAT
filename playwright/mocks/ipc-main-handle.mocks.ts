import {
  PROJECT_INVALID,
  PROJECT_NEW,
  PROJECT_OFFICE_HVAC
} from './projects.mocks';

export class IPC_MAIN_HANDLE_MOCKS {
  static readonly showOpenDialog = {
    channel: 'test-dialog-showOpenDialog',
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

  static readonly showMessageBox = {
    channel: 'test-dialog-showMessageBox',
    ok: {
      response: 0
    }
  };
}
