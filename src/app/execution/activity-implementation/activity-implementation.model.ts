export class ActivityImplementation {

  constructor(
    public id?: number,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number,
    public period_id?: number,
    public activity_id?: number,
    public facility_type_id?: number,
    public facility_id?: number,
    public facility_name?: string,
    public facility_code?: string,
    public code?: string,
    public description?: string,
    public budget?: number,
    public expenditure?: number,
    public balance?: number,
    public quarter?: string,
    public status?: string,
    public procurement_method?: string,
    public indicator?: string,
    public indicator_value?: string,
    public project_output?: string,
    public planned_value?: string,
    public project_output_implemented?: number,
    public actual_implementation?: string,
    public remarks?: string,
    public file?: any,
    public url?: string,
    public achievement?: string,
    public financial_actual_implementation?: number,
    public physical_actual_implementation?: number,
  ) {}
}

export class ProcurementMethod {
  constructor(
    public name?: string
  ) {
  }
}
export class ImplementationStatus {
  constructor(
    public name?: string
  ) {
  }
}
