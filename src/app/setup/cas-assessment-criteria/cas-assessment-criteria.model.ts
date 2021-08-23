export class CasAssessmentCriteria {
  constructor(
    public id?: number,
    public cas_assessment_category_version_id?: number,
    public name?: string,
    public number?: number,
    public how_to_assess?: string,
    public how_to_score?: string
  ) {}
}
