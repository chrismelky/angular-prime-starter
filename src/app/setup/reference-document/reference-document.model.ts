export class ReferenceDocument {
  constructor(
    public id?: number,
    public name?: string,
    public url?: string,
    public description?: string,
    public start_financial_year_id?: number,
    public end_financial_year_id?: number,
    public admin_hierarchy_id?: number,
    public reference_document_type_id?: number
  ) {}
}
