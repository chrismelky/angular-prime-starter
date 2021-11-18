export class CasPlan {
  constructor(
    public id?: number,
    public name?: string,
    public sector_id?: number,
    public admin_hierarchy_position?: number,
    public period_type?: string,
    public content_type?: string,
    public is_active?: boolean
  ) {}
}
