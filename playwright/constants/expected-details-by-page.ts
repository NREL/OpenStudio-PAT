export interface PageDetails {
  route: string;
  iconAlt: string;
  iconImgName: string;
}

export enum PAGES {
  ANALYSIS = 'Analysis',
  DESIGN_ALTERNATIVES = 'Design Alternatives',
  OUTPUTS = 'Outputs',
  RUN = 'Run',
  REPORTS = 'Reports',
  SERVER = 'Server'
}

export const EXPECTED_DETAILS_BY_PAGE: Record<PAGES, PageDetails> = {
  [PAGES.ANALYSIS]: {
    route: '/analysis',
    iconAlt: 'Analysis',
    iconImgName: 'measure_icon.png'
  },
  [PAGES.DESIGN_ALTERNATIVES]: {
    route: '/design_alternatives',
    iconAlt: 'Design Alternatives',
    iconImgName: 'design_alts_icon.png'
  },
  [PAGES.OUTPUTS]: {
    route: '/outputs',
    iconAlt: 'Outputs',
    iconImgName: 'outputs_icon.png'
  },
  [PAGES.RUN]: {
    route: '/run',
    iconAlt: 'Run',
    iconImgName: 'run_icon.png'
  },
  [PAGES.REPORTS]: {
    route: '/reports',
    iconAlt: 'Reports',
    iconImgName: 'reports_icon.png'
  },
  [PAGES.SERVER]: {
    route: '/server',
    iconAlt: 'Server',
    iconImgName: 'server_icon.png'
  }
};
