export interface PageDetails {
  route: string;
  iconAlt: string;
  iconImgName: string;
}

export enum Page {
  ANALYSIS = 'Analysis',
  DESIGN_ALTERNATIVES = 'Design Alternatives',
  OUTPUTS = 'Outputs',
  RUN = 'Run',
  REPORTS = 'Reports',
  SERVER = 'Server'
}

export const EXPECTED_DETAILS_BY_PAGE: Record<Page, PageDetails> = {
  [Page.ANALYSIS]: {
    route: '/analysis',
    iconAlt: 'Analysis',
    iconImgName: 'measure_icon.png'
  },
  [Page.DESIGN_ALTERNATIVES]: {
    route: '/design_alternatives',
    iconAlt: 'Design Alternatives',
    iconImgName: 'design_alts_icon.png'
  },
  [Page.OUTPUTS]: {
    route: '/outputs',
    iconAlt: 'Outputs',
    iconImgName: 'outputs_icon.png'
  },
  [Page.RUN]: {
    route: '/run',
    iconAlt: 'Run',
    iconImgName: 'run_icon.png'
  },
  [Page.REPORTS]: {
    route: '/reports',
    iconAlt: 'Reports',
    iconImgName: 'reports_icon.png'
  },
  [Page.SERVER]: {
    route: '/server',
    iconAlt: 'Server',
    iconImgName: 'server_icon.png'
  }
};
