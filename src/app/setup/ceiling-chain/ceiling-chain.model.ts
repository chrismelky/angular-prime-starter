export class CeilingChain {
  constructor(
    public id?: number,
    public for_admin_hierarchy_level_position?: number,
    public admin_hierarchy_level_position?: number,
    public next_id?: number,
    public section_level_position?: number,
    public active?: string
  ) {}
}
