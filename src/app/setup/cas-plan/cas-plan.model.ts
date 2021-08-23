export class CasPlan {
  constructor(
    public id?: number,
    public name?: string,
    public sector_id?: number,
    public admin_hierarchy_level_id?: number,
    public period_type?: string,
    public content_type?: string,
    public is_active?: string
  ) {}
}
