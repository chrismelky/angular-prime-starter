export class CasAssessmentCategoryVersion {
  constructor(
    public id?: number,
    public financial_year_id?: number,
    public reference_document_id?: number,
    public cas_assessment_state_id?: number,
    public cas_assessment_category_id?: number,
    public minimum_passmark?: number
  ) {}
}