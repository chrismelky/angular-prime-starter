export class AdminHierarchyLevel {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public position?: number,
    public code_required?: boolean,
    public can_budget?: boolean,
    public code_length?: number,
    public cost_centre_position?: number
  ) {}
}
