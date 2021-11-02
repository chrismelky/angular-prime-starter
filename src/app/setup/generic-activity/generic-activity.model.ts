import { AdminHierarchyLevel } from '../admin-hierarchy-level/admin-hierarchy-level.model';
import { BudgetClass } from '../budget-class/budget-class.model';
import { Section } from '../section/section.model';

export class GenericActivity {
  constructor(
    public id?: number,
    public description?: string,
    public params?: string,
    public planning_matrix_id?: number,
    public generic_target_id?: number,
    public priority_area_id?: number,
    public intervention_id?: number,
    public generic_sector_problem_id?: number,
    public is_active: boolean = true,
    public objective_id?: number,
    public sections: Section[] = [],
    public admin_hierarchy_levels: AdminHierarchyLevel[] = [],
    public project_output_id?: number,
    public expenditure_category_id?: number,
    public project_type_id?: number,
    public budget_class_id?: number,
    public project_id?: number,
    public activity_type_id?: number,
    public activity_task_nature_id?: number,
    public budget_class?: BudgetClass,
    public fund_sources?: string, //Fund sources ad json array string
    public indicator?: string
  ) {}
}
