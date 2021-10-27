export class ActivityInput {
  constructor(
    public id?: number,
    public unit_price?: number,
    public gfs_code_id?: number,
    public quantity?: number,
    public frequency?: number,
    public unit?: string,
    public period_one?: number,
    public period_two?: number,
    public period_three?: number,
    public period_four?: number,
    public has_breakdown: boolean = false,
    public breakdowns?: string,
    public forward_year_one_amount?: string,
    public forward_year_two_amount?: string,
    public activity_id?: number,
    public fund_source_id?: number,
    public financial_year_id?: number,
    public admin_hierarchy_id?: number,
    public facility_id?: number,
    public section_id?: number,
    public budget_class_id?: number,
    public activity_facility_id?: number,
    public activity_fund_source_id?: number
  ) {}
}
