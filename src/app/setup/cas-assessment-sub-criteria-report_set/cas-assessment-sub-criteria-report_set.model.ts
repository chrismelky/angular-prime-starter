export class CasAssessmentSubCriteriaReportSet {
  constructor(
    public id?: number,
    public cas_plan_id?: number,
    public cas_plan_content_id?: number,
    public report_id?: number,
    public cas_plan_contents?: any,
    public cas_assessment_sub_criteria_option_id?: number
  ) {}
}

export class MyNode {
  public id?: number;
  public label?: string;
  leaf?: boolean;
  children?: MyNode[];
  parent?: MyNode;
  }
