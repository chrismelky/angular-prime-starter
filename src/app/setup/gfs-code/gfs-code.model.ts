export class GfsCode {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public aggregated_code?: string,
    public account_type_id?: number,
    public category_id?: number,
    public is_procurement?: string,
    public is_protected?: string
  ) {}
}
