export class ReportSetup {
  constructor(
    public id?: number,
    public name?: string,
    public template_name?: string,
    public query_params?: string,
    public sql_query?: string,
    public cas_plan_content_id?: number
  ) {}
}
