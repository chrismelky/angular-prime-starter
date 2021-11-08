import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { DecisionLevel } from 'src/app/setup/decision-level/decision-level.model';
import { Section } from 'src/app/setup/section/section.model';

export class Scrutinization {
  constructor(
    public id?: number,
    public admin_hierarchy_cost_centre_id?: number,
    public admin_hierarchy_id?: number,
    public section_id?: number,
    public decision_level_id?: number,
    public from_decision_level_id?: number,
    public from_decision_level?: DecisionLevel,
    public financial_year_id?: number,
    public user_id?: number,
    public is_closed?: boolean,
    public is_returned?: boolean,
    public round?: number,
    public section?: Section,
    public admin_hierarchy?: AdminHierarchy,
    public budget_type?: string,
    public page?: number
  ) {}
}
