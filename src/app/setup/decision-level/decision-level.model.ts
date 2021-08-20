export class DecisionLevel {
  constructor(
    public id?: number,
    public name?: string,
    public admin_hierarchy_position_id?: number,
    public section_level_id?: number,
    public next_decision_level_ids?: string
  ) {}
}
