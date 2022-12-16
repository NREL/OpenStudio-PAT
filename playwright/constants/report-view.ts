export enum ReportView {
  SUMMARY_TABLE = 'Summary Table',
  SUMMARY_TABLE_NO_BASELINE = 'Summary Table No Baseline',
  END_USE_COMPARISON = 'End Use Comparison',
  EDAPT_EXPORT = 'EDAPT Export'
}

export const EXPECTED_REPORT_VIEWS = [
  ReportView.SUMMARY_TABLE,
  ReportView.SUMMARY_TABLE_NO_BASELINE,
  ReportView.END_USE_COMPARISON,
  ReportView.EDAPT_EXPORT
];
