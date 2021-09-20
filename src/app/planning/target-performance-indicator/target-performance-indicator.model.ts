export class TargetPerformanceIndicator {
  constructor(
    public id?: number,
    public long_term_target_id?: number,
    public performance_indicator_id?: number,
    public baseline_value?: string,
    public actual_value?: string,
    public year_values?: string
  ) {}
}
