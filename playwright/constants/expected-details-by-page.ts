export interface PageDetails {
  route: string;
  title: string;
  iconAlt: string;
  iconImgName: string;
}

export const EXPECTED_DETAILS_BY_PAGE: Record<string, PageDetails> = {
  ANALYSIS: {
    route: '/analysis',
    title: '',
    iconAlt: 'Analysis',
    iconImgName: 'measure_icon.png'
  },
  DESIGN_ALTERNATIVES: {
    route: '/design_alternatives',
    title: 'Design Alternatives',
    iconAlt: 'Design Alternatives',
    iconImgName: 'design_alts_icon.png'
  },
  OUTPUTS: {
    route: '/outputs',
    title: 'Outputs',
    iconAlt: 'Outputs',
    iconImgName: 'outputs_icon.png'
  },
  RUN: {
    route: '/run',
    title: 'Run',
    iconAlt: 'Run',
    iconImgName: 'run_icon.png'
  },
  REPORTS: {
    route: '/reports',
    title: 'Reports',
    iconAlt: 'Reports',
    iconImgName: 'reports_icon.png'
  },
  SERVER: {
    route: '/server',
    title: 'Server',
    iconAlt: 'Server',
    iconImgName: 'server_icon.png'
  }
};
