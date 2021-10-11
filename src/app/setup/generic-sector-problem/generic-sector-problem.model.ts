export class GenericSectorProblem {
  constructor(
    public id?: number,
    public code?: string,
    public description?: string,
    public params?: string,
    public priority_area_id?: number,
    public planning_matrix_id?: number
  ) {}
}
