export class ExpenditureCategory {
  constructor(
    public id?: number,
    public name?: string,
    public activity_task_nature_id?: number,
    public project_type_id?: number,
    public is_active?: string
  ) {}
}
