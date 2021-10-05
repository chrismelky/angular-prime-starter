export class ResponsiblePerson {
  constructor(
    public id?: number,
    public name?: string,
    public mobile?: string,
    public email?: string,
    public cheque_number?: string,
    public title?: string,
    public admin_hierarchy_id?: number,
    public sector_id?: number,
    public facility_id?: number,
    public is_active?: boolean
  ) {}
}
