export class ActivityInput {
  constructor(
    public id?: number,
    public unit_price?: string,
    public quantity?: string,
    public frequency?: string,
    public unit?: string,
    public forward_year_one_amount?: string,
    public forward_year_two_amount?: string,
    public activity_id?: number,
    public fund_source_id?: number,
    public financial_year_id?: number,
    public admin_hierarchy_id?: number,
    public facility_id?: number,
    public section_id?: number,
    public budget_class_id?: number,
    public chart_of_account?: string,
    public approve_amount?: string,
    public adjusted_amount?: string
  ) {}
}
