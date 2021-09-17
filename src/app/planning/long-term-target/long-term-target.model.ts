import { FinancialYearTarget } from './financial-year-target.model';

export class LongTermTarget {
  constructor(
    public id?: number,
    public description?: string,
    public strategic_plan_id?: number,
    public objective_id?: number,
    public code?: string,
    public section_id?: number,
    public financial_year_target?: FinancialYearTarget
  ) {}
}