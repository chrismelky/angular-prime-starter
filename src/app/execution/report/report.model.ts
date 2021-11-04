export class Report {
  constructor(
    public id?: number,
    public cas_plan_content_id?: number,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number
  ) {}

}
export class BudgetType {
  constructor(
    public id?: number,
    public name?: string
  ) {
  }
}
