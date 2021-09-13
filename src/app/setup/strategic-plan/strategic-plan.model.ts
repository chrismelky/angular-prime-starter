export class StrategicPlan {
  constructor(
    public id?: number,
    public admin_hierarchy_id?: number,
    public start_financial_year_id?: number,
    public end_financial_year_id?: number,
    public name?: string,
    public description?: string,
    public is_active?: string,
    public url?: string,
    public file?: File
  ) {}
}
