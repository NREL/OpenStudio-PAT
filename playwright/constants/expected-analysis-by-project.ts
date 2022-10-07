import { Projects } from './projects';

export enum AnalysisType {
  MANUAL = 'Manual',
  ALGORITHMIC = 'Algorithmic'
}

export interface AnalysisDetails {
  type: AnalysisType;
  algorithmicMethod?: string;
  defaultSeedModel?: string;
  defaultWeatherFile?: string;
  openStudioMeasures: string[];
  energyPlusMeasures: string[];
  reportingMeasures: string[];
}

export const EXPECTED_ANALYSIS_BY_PROJECT: Record<Projects, AnalysisDetails> = {
  [Projects.OFFICE_HVAC]: {
    type: AnalysisType.MANUAL,
    defaultSeedModel: 'SmallOffProto.osm',
    defaultWeatherFile: 'USA_CO_Golden-NREL.724666_TMY3.epw',
    openStudioMeasures: [
      'AedgOfficeHvacFanCoilDoas',
      'AedgOfficeHvacVavDx',
      'AedgOfficeHvacRadiantDoas',
      'AedgOfficeHvacVavChW'
    ],
    energyPlusMeasures: ['XcelEDATariffSelectionandModelSetup'],
    reportingMeasures: ['OpenStudio Results']
  },
  [Projects.OFFICE_STUDY]: {
    type: AnalysisType.ALGORITHMIC,
    algorithmicMethod: 'Design of Experiments (DOE)',
    defaultSeedModel: 'empty.osm',
    defaultWeatherFile: 'USA_CO_Golden-NREL.724666_TMY3.epw',
    openStudioMeasures: [
      'Create DOE Prototype Building',
      'Reduce Lighting Loads by Percentage',
      'Reduce Electric Equipment Loads by Percentage',
      'Add Rooftop PV'
    ],
    energyPlusMeasures: ['XcelEDATariffSelectionandModelSetup'],
    reportingMeasures: ['OpenStudio Results']
  },
  [Projects.NEW]: { type: AnalysisType.MANUAL, openStudioMeasures: [], energyPlusMeasures: [], reportingMeasures: [] }
};
