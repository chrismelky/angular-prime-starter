export class TargetPerformanceIndicator {
  constructor(
    public id?: number,
    public long_term_target_id?: number,
    public performance_indicator_id?: number,
    public baseline_value?: string,
    public actual_value?: string,
    public source_of_data?: string,
    public baseline_date?: string,
    public y0?: number,
    public y1?: number,
    public y2?: number,
    public y3?: number,
    public y4?: number
  ) {}
}
