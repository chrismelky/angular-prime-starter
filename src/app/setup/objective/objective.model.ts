export class Objective {
  constructor(
    public id?: number,
    public description?: string,
    public code?: string,
    public objective_type_id?: number,
    public parent_id?: number
  ) {}
}
