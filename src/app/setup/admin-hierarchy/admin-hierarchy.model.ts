export class AdminHierarchy {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public parent_id?: number,
    public admin_hierarchy_position?: number,
    public current_budget_locked?: string,
    public is_carryover_budget_locked?: string,
    public is_supplementary_budget_locked?: string,
    public is_current_budget_approved?: string,
    public is_carryover_budget_approved?: string,
    public is_supplementary_budget_approved?: string,
    public current_budget_decision_level_id?: number,
    public carryover_budget_decision_level_id?: number,
    public supplementary_budget_decision_level_id?: number,
    public current_financial_year_id?: number,
    public is_current_budget_locked?:boolean,
    public parent?: AdminHierarchy
  ) {}
}
