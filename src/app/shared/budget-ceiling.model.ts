export class BudgetCeiling{
  constructor(
    public id?: number,
    public admin_ceiling_id?: number,
    public fund_source_id?:number,
    public budget_class_id?:number,
    public planning_admin_hierarchy_id?:number,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number,
    public section_id?: number,
    public facility_id?: number,
    public active?: boolean,
    public is_locked?: boolean,
    public is_approved?: boolean,
    public budget_type?: string,
    public amount?: number,
    public ceiling_id?:number,
  ) {}
}
