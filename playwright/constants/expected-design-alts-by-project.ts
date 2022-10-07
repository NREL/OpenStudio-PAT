import { AnalysisType, EXPECTED_ANALYSIS_TYPE_BY_PROJECT } from './expected-analysis-type-by-project';
import { DatapointState, EXPECTED_DATAPOINTS_BY_PROJECT } from './expected-datapoints-by-project';
import { Projects } from './projects';

export enum DesignAltColumn {
  name = 0,
  seedModel = 1,
  locationOrWeatherFile = 2,
  description = 3
}

export type DesignAltDetails = Record<DesignAltColumn, string>;

const EXPECTED_SEED_MODEL_BY_PROJECT: Partial<Record<Projects, string>> = {
  [Projects.OFFICE_HVAC]: 'proto.osm'
};
const EXPECTED_WEATHER_FILE_BY_PROJECT: Partial<Record<Projects, string | undefined>> = {
  [Projects.OFFICE_HVAC]: 'USA_CO_Golden-NREL.724666_TMY3.epw'
};

const generateExpectedDesignAltsByProject = () => {
  const generated = {};
  for (const project in EXPECTED_DATAPOINTS_BY_PROJECT) {
    if (EXPECTED_ANALYSIS_TYPE_BY_PROJECT[project] === AnalysisType.MANUAL) {
      generated[project] = EXPECTED_DATAPOINTS_BY_PROJECT[project].map((datapoint: DatapointState) => ({
        [DesignAltColumn.name]: datapoint.name,
        [DesignAltColumn.seedModel]: EXPECTED_SEED_MODEL_BY_PROJECT[project] ?? '',
        [DesignAltColumn.locationOrWeatherFile]: EXPECTED_WEATHER_FILE_BY_PROJECT[project] ?? '',
        [DesignAltColumn.description]: ''
      }));
    } else {
      generated[project] = undefined;
    }
  }
  return generated as Record<Projects, DesignAltDetails[] | undefined>;
};
export const EXPECTED_DESIGN_ALTS_BY_PROJECT = generateExpectedDesignAltsByProject();
