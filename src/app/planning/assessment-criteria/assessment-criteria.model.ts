import {AdminHierarchy} from "../../setup/admin-hierarchy/admin-hierarchy.model";
import {FinancialYear} from "../../setup/financial-year/financial-year.model";
import {CasAssessmentRound} from "../../setup/cas-assessment-round/cas-assessment-round.model";

export class AssessmentCriteria {
  constructor(
    public id?: number,
    public name?: string,
    public number?: number,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number,
    public cas_assessment_round_id?: number,
    public admin_hierarchy?: AdminHierarchy [],
    public financial_year?: FinancialYear [],
    public assessment_round?: CasAssessmentRound[],
  ) {}
}
