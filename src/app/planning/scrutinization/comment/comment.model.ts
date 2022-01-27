export class Comment {
  constructor(
    public id?: number,
    public scrutinization_id?: number,
    public admin_hierarchy_cost_centre_id?: number,
    public admin_hierarchy_id?: number,
    public section_id?: number,
    public financial_year_id?: number,
    public commentable_id?: number,
    public commentable_type?: string,
    public comments?: string,
    public address_comments?: string,
    public is_addressed?: boolean,
    public addressed_by?: string
  ) {}
}
