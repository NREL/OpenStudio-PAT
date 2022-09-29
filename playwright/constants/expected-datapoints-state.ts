import { PROJECTS } from './projects';

export interface DATAPOINT_STATE {
  name: string;
  isChecked: boolean;
}

export const EXPECTED_DATAPOINTS_STATE: Record<PROJECTS, DATAPOINT_STATE[]> = {
  [PROJECTS.OFFICE_HVAC]: [
    {
      name: 'Baseline',
      isChecked: false
    },
    {
      name: 'Fan Coil DOAS',
      isChecked: false
    },
    {
      name: 'VAV DX',
      isChecked: false
    },
    {
      name: 'Radiant DOAS',
      isChecked: false
    },
    {
      name: 'VAV Chilled Water',
      isChecked: false
    }
  ],
  [PROJECTS.NEW]: []
};
