import { Section } from '../section/section.model';

export class AdminHierarchyLevel {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public position?: number,
    public code_required?: boolean,
    public can_budget?: boolean,
    public code_length?: number,
    public default_decision_level_id?: number,
    public cost_centres?: Section[]
  ) {}
}
