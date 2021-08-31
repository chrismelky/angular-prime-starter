import {CasAssessmentCategory} from "../cas-assessment-category/cas-assessment-category.model";

export class CasAssessmentCriteriaOption {
  constructor(
    public id?: number,
    public name?: string,
    public number?: number,
    public cas_assessment_category_version_id?: number,
    public cas_assessment_category?: CasAssessmentCategory,
  ) {}
}
