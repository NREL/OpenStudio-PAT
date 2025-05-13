import { Projects } from './projects';

export enum OutputColumn {
  displayName = 0,
  shortName = 1,
  variableType = 2,
  visualize = 3,
  objectiveFunction = 4,
  targetValue = 5,
  units = 6,
  weightingFactor = 7
}

export type OutputDetails = Record<OutputColumn, string>;

export type MeasureOutputs = Record<string, OutputDetails[]>;

export const EXPECTED_MEASURE_OUTPUTS_BY_PROJECT: Record<Projects, MeasureOutputs | undefined> = {
  [Projects.OFFICE_HVAC]: undefined,
  [Projects.OFFICE_STUDY]: {
    'OpenStudio Results': [
      {
        [OutputColumn.displayName]: 'net_site_energy',
        [OutputColumn.shortName]: 'net_site_energy',
        [OutputColumn.variableType]: 'Double',
        [OutputColumn.visualize]: 'true',
        [OutputColumn.objectiveFunction]: 'true',
        [OutputColumn.targetValue]: '0',
        [OutputColumn.units]: '',
        [OutputColumn.weightingFactor]: ''
      }
    ]
  },
  [Projects.NEW]: undefined
};
