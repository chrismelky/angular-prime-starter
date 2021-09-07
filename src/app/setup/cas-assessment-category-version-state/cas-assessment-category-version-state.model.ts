import {CasAssessmentCategory} from "../cas-assessment-category/cas-assessment-category.model";

export class CasAssessmentCategoryVersionState {
  constructor(
    public id?: number,
    public min_value?: number,
    public cas_assessment_category_version_id?: number,
    public cas_assessment_category?: CasAssessmentCategory,
    public cas_assessment_state_id?: number,
    public max_value?: number
  ) {}
}