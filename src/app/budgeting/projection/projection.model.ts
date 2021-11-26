export class Projection {
  constructor(
    public id?: number,
    public projection_type_id?: number,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number,
    public gfs_code_id?: number,
    public section_id?: number,
    public fund_source_id?: number,
    public facility_id?: number,
    public active?: string,
    public q1_amount?: number,
    public q2_amount?: number,
    public q3_amount?: number,
    public q4_amount?: number,
    public amount?: number,
    public forwad_year1_amount?: number,
    public forwad_year2_amount?: number,
    public chart_of_account?: string,
    public export_to?: string,
    public is_sent?: string,
    public delivered?: string,
    public deleted?: string
  ) {}
}
