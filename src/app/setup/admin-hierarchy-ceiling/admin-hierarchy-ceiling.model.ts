export class AdminHierarchyCeiling {
  constructor(
    public id?: number,
    public ceiling_id?: number,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number,
    public parent_id?: number,
    public section_id?: number,
    public active?: string,
    public is_locked?: string,
    public is_approved?: string,
    public budget_type?: string,
    public amount?: string,
    public deleted?: string
  ) {}
}
