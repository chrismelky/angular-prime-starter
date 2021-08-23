export class CasAssessmentSubCriteria {
  constructor(
    public id?: number,
    public name?: string,
    public serial_number?: number,
    public how_to_assess?: string,
    public how_to_score?: string,
    public cas_assessment_criteria_id?: number,
    public score_value?: number,
    public is_free_score?: string
  ) {}
}
