export class SectorProblem {
  constructor(
    public id?: number,
    public description?: string,
    public number?: number,
    public is_active?: boolean,
    public priority_area_id?: number,
    public admin_hierarchy_id?: number,
    public generic_sector_problem_id?: number
  ) {}
}
