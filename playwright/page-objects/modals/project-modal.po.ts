import { App } from '../../App';
import { IPC_MAIN_HANDLE_MOCKS, ShowMessageBoxMock, ShowOpenDialogMock } from '../../mocks';
import { ModalPO } from './modal.po';

export interface ProjectModalArgs {
  showOpenDialog?: any;
  showMessageBox?: any;
}
export class ProjectModalPO extends ModalPO {
  static readonly EXPECTED_TITLE: string;
  static readonly EXPECTED_FOOTER_BUTTONS: Record<string, string>;
  static readonly OPEN_BUTTON_TEXT: string;

  static async open(showOpenDialogMock?: ShowOpenDialogMock, showMessageBoxMock?: ShowMessageBoxMock) {
    const args: ProjectModalArgs = {};

    if (showOpenDialogMock !== undefined) {
      args.showOpenDialog = App.mockIpcMainHandle(IPC_MAIN_HANDLE_MOCKS.showOpenDialogChannel, showOpenDialogMock);
    }
    if (showMessageBoxMock !== undefined) {
      args.showMessageBox = App.mockIpcMainHandle(IPC_MAIN_HANDLE_MOCKS.showMessageBoxChannel, showMessageBoxMock);
    }

    await this.clickButton(this.OPEN_BUTTON_TEXT);

    for (const key in args) {
      args[key] = await args[key];
    }
    await App.removeAllIpcMainListeners();

    return args;
  }
}
