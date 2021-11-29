import { GenericTargetService } from 'src/app/setup/generic-target/generic-target.service';
import { NationalReference } from 'src/app/setup/national-reference/national-reference.model';
import { FinancialYearTarget } from './financial-year-target.model';

export class LongTermTarget {
  constructor(
    public id?: number,
    public description?: string,
    public strategic_plan_id?: number,
    public admin_hierarchy_id?: number,
    public objective_id?: number,
    public generic_target_id?: number,
    public code?: string,
    public section_id?: number,
    public financial_year_target?: FinancialYearTarget,
    public references?: NationalReference[],
    public genericTarget?: GenericTargetService
  ) {}
}
