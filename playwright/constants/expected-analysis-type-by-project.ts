import { Projects } from './projects';

export enum AnalysisType {
  MANUAL = 'Manual',
  ALGORITHMIC = 'Algorithmic'
}

export const EXPECTED_ANALYSIS_TYPE_BY_PROJECT: Record<Projects, AnalysisType> = {
  [Projects.OFFICE_HVAC]: AnalysisType.MANUAL,
  [Projects.OFFICE_STUDY]: AnalysisType.ALGORITHMIC,
  [Projects.NEW]: AnalysisType.MANUAL
};
