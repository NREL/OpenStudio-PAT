import { Projects } from './projects';

export enum AnalysisType {
  MANUAL = 'Manual',
  ALGORITHMIC = 'Algorithmic'
}

export enum MeasureTypes {
  OPEN_STUDIO = 'OpenStudio Measures',
  ENERGY_PLUS = 'EnergyPlus Measures',
  REPORTING = 'Reporting Measures'
}

export interface AnalysisDetails {
  type: AnalysisType;
  algorithmicMethod?: string;
  defaultSeedModel?: string;
  defaultWeatherFile?: string;
  [MeasureTypes.OPEN_STUDIO]: string[];
  [MeasureTypes.ENERGY_PLUS]: string[];
  [MeasureTypes.REPORTING]: string[];
}

export const EXPECTED_ANALYSIS_BY_PROJECT: Record<Projects, AnalysisDetails> = {
  [Projects.OFFICE_HVAC]: {
    type: AnalysisType.MANUAL,
    defaultSeedModel: 'SmallOffProto.osm',
    defaultWeatherFile: 'USA_CO_Golden-NREL.724666_TMY3.epw',
    [MeasureTypes.OPEN_STUDIO]: [
      'AedgOfficeHvacFanCoilDoas',
      'AedgOfficeHvacVavDx',
      'AedgOfficeHvacRadiantDoas',
      'AedgOfficeHvacVavChW'
    ],
    [MeasureTypes.ENERGY_PLUS]: ['XcelEDATariffSelectionandModelSetup'],
    [MeasureTypes.REPORTING]: ['OpenStudio Results']
  },
  [Projects.OFFICE_STUDY]: {
    type: AnalysisType.ALGORITHMIC,
    algorithmicMethod: 'Design Of Experiments (DOE)',
    defaultSeedModel: 'empty.osm',
    defaultWeatherFile: 'USA_CO_Golden-NREL.724666_TMY3.epw',
    [MeasureTypes.OPEN_STUDIO]: [
      'Create DOE Prototype Building',
      'Reduce Lighting Loads by Percentage',
      'Reduce Electric Equipment Loads by Percentage',
      'Add Rooftop PV'
    ],
    [MeasureTypes.ENERGY_PLUS]: ['XcelEDATariffSelectionandModelSetup'],
    [MeasureTypes.REPORTING]: ['OpenStudio Results']
  },
  [Projects.NEW]: {
    type: AnalysisType.MANUAL,
    defaultSeedModel: '',
    defaultWeatherFile: '',
    [MeasureTypes.OPEN_STUDIO]: [],
    [MeasureTypes.ENERGY_PLUS]: [],
    [MeasureTypes.REPORTING]: []
  }
};
