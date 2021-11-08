export class FacilityBankAccount {
  constructor(
    public id?: number,
    public bank?: string,
    public branch?: string,
    public account_name?: string,
    public account_number?: string,
    public facility_id?: number
  ) {}
}
