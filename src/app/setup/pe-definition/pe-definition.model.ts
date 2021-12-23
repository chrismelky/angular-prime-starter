export class PeDefinition {
  constructor(
    public id?: number,
    public field_name?: string,
    public parent_id?: number,
    public gfs_code_id?: number,
    public sort_order?: number,
    public unit?: string,
    public is_input?: boolean,
    public has_breakdown?: string,
    public pe_form_id?: number,
    public is_active?: string,
    public column_number?: number,
    public formula?: string,
    public type?: string,
    public select_option?: string,
    public is_vertical?: string,
    public output_type?: string
  ) {}
}
