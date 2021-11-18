
export class Attachment{
  constructor(
    public id?: number,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number,
    public budget_type?: string,
    public document_url?: string,
  ) {}
}
