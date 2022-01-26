export class DataSet {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public cas_plan_content_id?: number,
    public cas_plan_id?: number,
    public is_locked?: boolean,
    public is_submitted?: boolean,
    public facility_types?: string,
    public periods?: string,
    public sort_order?: number
  ) {}
}
