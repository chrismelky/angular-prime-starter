export class PeSubForm {
  constructor(
    public id?: number,
    public parent_id?: number,
    public name?: string,
    public code?: string,
    public pe_form_id?: number,
    public is_lowest?: string,
    public sort_order?: number,
    public is_multiple?: string,
    public is_active?: string,
    public is_fund_source_required?: string,
    public is_sbc_required?: string
  ) {}
}
