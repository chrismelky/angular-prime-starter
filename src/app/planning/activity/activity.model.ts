import { BudgetClass } from 'src/app/setup/budget-class/budget-class.model';

export class Activity {
  constructor(
    public id?: number,
    public description?: string,
    public code?: string,
    public indicator?: string,
    public indicator_value?: string,
    public long_term_target_id?: number,
    public financial_year_target_id?: number,
    public financial_year_id?: number,
    public budget_class_id?: number,
    public activity_type_id?: number,
    public admin_hierarchy_id?: number,
    public section_id?: number,
    public facility_id?: number,
    public activity_task_nature_id?: number,
    public budget_type?: string,
    public project_id?: number,
    public intervention_id?: number,
    public sector_problem_id?: number,
    public generic_activity_id?: number,
    public responsible_person_id?: number,
    public period_type?: string,
    public period_one?: string,
    public period_two?: string,
    public period_three?: string,
    public period_four?: string,
    public is_active?: string,
    public budget_class?: BudgetClass
  ) {}
}
