import { TMP_TEST_PATH } from '../paths';

export enum PROJECTS {
  OFFICE_HVAC = 'Office_HVAC',
  OFFICE_STUDY = 'Office_Study',
  NEW = 'Playwright_Project'
}

export const PROJECT_PATHS: Record<PROJECTS, string> = {
  [PROJECTS.OFFICE_HVAC]: `${TMP_TEST_PATH}/Office_HVAC`,
  [PROJECTS.OFFICE_STUDY]: `${TMP_TEST_PATH}/Office_Study`,
  [PROJECTS.NEW]: TMP_TEST_PATH
};

export const PROJECT_PATH_INVALID = `${TMP_TEST_PATH}/empty`;
