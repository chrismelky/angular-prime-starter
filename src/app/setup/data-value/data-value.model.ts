export class DataValue {
  constructor(
    public id?: number,
    public data_element_id?: number,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number,
    public facility_id?: number,
    public category_option_combination_id?: number,
    public value?: string
  ) {}
}

export class ImportStatus {
  constructor(
    public imported?: number,
    public all?: number,
    public errors?: any[]
  ) {}
}
