export class ReferenceDocument {
  constructor(
    public id?: number,
    public name?: string,
    public url?: string,
    public start_financial_year_id?: number,
    public end_financial_year_id?: number,
    public admin_hierarchy_id?: number
  ) {}
}
