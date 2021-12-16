export class Report {
  constructor(
    public id?: number,
    public period_id?: number,
    public fund_source_id?: number,
    public cas_plan_id?: number,
    public section_id?: number,
    public sector_id?: number,
    public department_id?: number,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number,
    public query_params?: string,
    public control_code?: string,
    public fund_source_pe?: number,
    public intervention_id?: number,
    public exchange_rate?: number,
    public budget_class_id?: number,
    public data_set_id?: number,
    public is_periodic?: boolean,
    public budget_type?: string,
    public is_facility_account?: boolean,
    public default_values?: any,
    public formart?: string
  ) {}
}
export class BudgetType {
  constructor(public id?: number, public name?: string) {}
}
