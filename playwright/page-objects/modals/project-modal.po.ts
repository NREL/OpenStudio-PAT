import { App } from '../../App';
import { IPC_MAIN_HANDLE_MOCKS, ShowMessageBoxMock, ShowOpenDialogMock } from '../../mocks';
import { ModalPO } from './modal.po';

export interface ProjectModalArgsPromises {
  showOpenDialog?: Promise<any>;
  showMessageBox?: Promise<any>;
}
export class ProjectModalPO extends ModalPO {
  static readonly EXPECTED_TITLE: string;
  static readonly EXPECTED_FOOTER_BUTTONS: Record<string, string>;
  static readonly OPEN_BUTTON_TEXT: string;

  static async open(showOpenDialogMock?: ShowOpenDialogMock, showMessageBoxMock?: ShowMessageBoxMock) {
    const argsPromises: ProjectModalArgsPromises = {};

    if (showOpenDialogMock !== undefined) {
      argsPromises.showOpenDialog = App.mockIpcMainHandle(
        IPC_MAIN_HANDLE_MOCKS.showOpenDialogChannel,
        showOpenDialogMock
      );
    }
    if (showMessageBoxMock !== undefined) {
      argsPromises.showMessageBox = App.mockIpcMainHandle(
        IPC_MAIN_HANDLE_MOCKS.showMessageBoxChannel,
        showMessageBoxMock
      );
    }

    await this.clickButton(this.OPEN_BUTTON_TEXT);

    return argsPromises;
  }
}
