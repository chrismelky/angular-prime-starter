export class Scrutinization {
  constructor(
    public id?: number,
    public admin_hierarchy_id?: number,
    public section_id?: number,
    public code?: string,
    public description?: string,
    public budget?: number,
    public expenditure?: number,
    public balance?: number
  ) {}
}
