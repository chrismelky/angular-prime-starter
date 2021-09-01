import { BaselineStatistic } from '../baseline-statistic/baseline-statistic.model';

export class BaselineStatisticValue {
  constructor(
    public id?: number,
    public baseline_statistic_id?: number,
    public baseline_statistic?: BaselineStatistic,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number,
    public value?: string,
    public active?: boolean
  ) {}
}
