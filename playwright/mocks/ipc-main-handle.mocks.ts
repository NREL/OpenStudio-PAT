const VALID_NEW_PROJECT_PATH = './playwright/.tmp/Playwright__Project';
const VALID_EXISTING_PROJECT_PATH = './sample_projects/Office_HVAC';
const INVALID_EXISTING_PROJECT_PATH = './sample_projects/calibration_data';

export class IPC_MAIN_HANDLE_MOCKS {
  static readonly showOpenDialog = {
    channel: 'test-dialog-showOpenDialog',
    validNew: {
      canceled: false,
      filePaths: [VALID_NEW_PROJECT_PATH]
    },
    validExisting: {
      canceled: false,
      filePaths: [VALID_EXISTING_PROJECT_PATH]
    },
    invalidExisting: {
      canceled: false,
      filePaths: [INVALID_EXISTING_PROJECT_PATH]
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
