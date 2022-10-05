import { PROJECTS } from './projects';

export enum AnalysisType {
  MANUAL = 'Manual',
  ALGORITHMIC = 'Algorithmic'
}

export const EXPECTED_ANALYSIS_TYPE_BY_PROJECT: Record<PROJECTS, AnalysisType> = {
  [PROJECTS.OFFICE_HVAC]: AnalysisType.MANUAL,
  [PROJECTS.OFFICE_STUDY]: AnalysisType.ALGORITHMIC,
  [PROJECTS.NEW]: AnalysisType.MANUAL
};
