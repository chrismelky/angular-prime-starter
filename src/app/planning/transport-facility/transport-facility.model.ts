export class TransportFacility {
  constructor(
    public id?: number,
    public name?: string,
    public registration_number?: string,
    public date_of_acquisition?: string,
    public mileage?: string,
    public type?: string,
    public comment?: string,
    public station?: string,
    public ownership?: string,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number,
    public asset_condition_id?: number,
    public asset_use_id?: number,
    public transport_category_id?: number,
    public insurance_type?: string
  ) {}
}
