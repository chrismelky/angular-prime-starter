export class ProjectDataForm {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public parent_id?: number,
    public is_lowest?: string,
    public is_active?: string,
    public sort_order?: number
  ) {}
}

