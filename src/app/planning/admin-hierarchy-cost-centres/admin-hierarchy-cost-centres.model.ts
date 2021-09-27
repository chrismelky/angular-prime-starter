import { DecisionLevel } from 'src/app/setup/decision-level/decision-level.model';
import { Section } from 'src/app/setup/section/section.model';

export class AdminHierarchyCostCentres {
  constructor(
    public id?: number,
    public admin_hierarchy_id?: number,
    public section_id?: number,
    public is_current_budget_locked?: string,
    public is_carryover_budget_locked?: string,
    public is_supplementary_budget_locked?: string,
    public is_current_budget_approved?: string,
    public is_carryover_budget_approved?: string,
    public is_supplementary_budget_approved?: string,
    public current_budget_decision_level_id?: number,
    public current_budget_decision_level?: DecisionLevel,
    public carryover_budget_decision_level_id?: number,
    public carryover_budget_decision_level?: DecisionLevel,
    public supplementary_budget_decision_level_id?: number,
    public supplementary_budget_decision_level?: DecisionLevel,
    public section?: Section
  ) {}
}
