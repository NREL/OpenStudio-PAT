import { TMP_TEST_PATH } from '../paths';

export enum Projects {
  OFFICE_HVAC = 'Office_HVAC',
  OFFICE_STUDY = 'Office_Study',
  NEW = 'Playwright_Project'
}

export const PROJECT_PATHS: Record<Projects, string> = {
  [Projects.OFFICE_HVAC]: `${TMP_TEST_PATH}/Office_HVAC`,
  [Projects.OFFICE_STUDY]: `${TMP_TEST_PATH}/Office_Study`,
  [Projects.NEW]: TMP_TEST_PATH
};

export const PROJECT_PATH_INVALID = `${TMP_TEST_PATH}/empty`;
