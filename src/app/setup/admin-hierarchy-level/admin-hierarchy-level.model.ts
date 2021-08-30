export class AdminHierarchyLevel {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public position?: number,
    public code_required?: boolean,
    public code_length?: number
  ) {}
}
