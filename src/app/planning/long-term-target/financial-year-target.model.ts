export class FinancialYearTarget {
  constructor(
    public id?: number,
    public description?: string,
    public long_term_target_id?: number,
    public financial_year_id?: number,
    public admin_hierarchy_id?: number,
    public objective_id?: number,
    public code?: string,
    public section_id?: number
  ) {}
}
