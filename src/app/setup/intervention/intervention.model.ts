export class Intervention {
  constructor(
    public id?: number,
    public description?: string,
    public intervention_category_id?: number,
    public priority_area_id?: number,
    public is_primary?: string
  ) {}
}
