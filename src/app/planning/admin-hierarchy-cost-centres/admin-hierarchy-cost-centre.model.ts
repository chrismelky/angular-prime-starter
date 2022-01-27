import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { DecisionLevel } from 'src/app/setup/decision-level/decision-level.model';
import { Section } from 'src/app/setup/section/section.model';
import { Comment } from '../scrutinization/comment/comment.model';

export class AdminHierarchyCostCentre {
  constructor(
    public id?: number,
    public admin_hierarchy_id?: number,
    public section_id?: number,
    public is_current_budget_locked?: boolean,
    public is_carryover_budget_locked?: boolean,
    public is_supplementary_budget_locked?: boolean,
    public is_current_budget_approved?: boolean,
    public is_carryover_budget_approved?: boolean,
    public is_supplementary_budget_approved?: boolean,
    public current_budget_decision_level_id?: number,
    public current_budget_decision_level?: DecisionLevel,
    public carryover_budget_decision_level_id?: number,
    public carryover_budget_decision_level?: DecisionLevel,
    public supplementary_budget_decision_level_id?: number,
    public supplementary_budget_decision_level?: DecisionLevel,
    public section?: Section,
    public admin_hierarchy?: AdminHierarchy,
    public addressable_comments?: Comment[]
  ) {}
}
