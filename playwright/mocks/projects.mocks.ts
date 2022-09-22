import { TMP_TEST_PATH } from '../paths';

export interface ProjectMock {
  name: string;
  path: string;
}

export const PROJECT_OFFICE_HVAC: ProjectMock = {
  name: 'Office_HVAC',
  path: `${TMP_TEST_PATH}/Office_HVAC`
};

export const PROJECT_NEW: ProjectMock = {
  name: 'Playwright_Project',
  path: TMP_TEST_PATH
};

export const PROJECT_INVALID: ProjectMock = {
  name: 'empty',
  path: `${TMP_TEST_PATH}/empty`
};
