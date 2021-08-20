export class FinancialYear {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public previous_financial_year_id?: number,
    public is_active?: string,
    public is_current?: string,
    public status?: number,
    public sort_order?: number,
    public start_date?: string,
    public end_date?: string
  ) {}
}
