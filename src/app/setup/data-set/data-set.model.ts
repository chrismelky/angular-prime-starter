export class DataSet {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public cas_plan_content_id?: number,
    public is_locked?: string,
    public is_submitted?: string
  ) {}
}
