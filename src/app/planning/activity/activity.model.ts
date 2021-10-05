import { BudgetClass } from 'src/app/setup/budget-class/budget-class.model';
import { Facility } from 'src/app/setup/facility/facility.model';
import { FundSource } from 'src/app/setup/fund-source/fund-source.model';

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
    public period_one?: boolean,
    public period_two?: boolean,
    public period_three?: boolean,
    public period_four?: boolean,
    public is_active?: boolean,
    public budget_class?: BudgetClass,
    public fund_sources?: FundSource[],
    public activity_facilities?: any[]
  ) {}
}