export class AssessorAssignment {
  constructor(
    public id?: number,
    public user_id?: number,
    public admin_hierarchy_id?: number,
    public admin_hierarchy_level_id?: number,
    public cas_assessment_round_id?: number,
    public period_id?: number,
    public cas_assessment_category_version_id?: number,
    public financial_year_id?: number,
    public active?: string
  ) {}
}
