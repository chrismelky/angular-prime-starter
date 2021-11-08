export class DecisionLevel {
  constructor(
    public id?: number,
    public name?: string,
    public admin_hierarchy_level_position?: number,
    public section_level_position?: number,
    public next_decision_level_id?: number,
    public next_decision_level?: DecisionLevel
  ) {}
}
