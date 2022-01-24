import { FacilityType } from '../facility-type/facility-type.model';
import { AdminHierarchy } from '../admin-hierarchy/admin-hierarchy.model';
import { FinancialYear } from '../financial-year/financial-year.model';

export class Facility {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public facility_type_id?: number,
    public facility_type?: FacilityType,
    public admin_hierarchy_id?: number,
    public admin_hierarchy?: AdminHierarchy,
    public budget_start_financial_year_id?: number,
    public budget_start_financial_year?: FinancialYear,
    public ownership?: string,
    public p1?: number,
    public p2?: number,
    public p3?: number,
    public p4?: number,
    public p5?: number,
    public planning_hierarchy_position?: number,
    public active?: boolean
  ) {}
}

export class FacilityView {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public type_id?: number,
    public type?: string,
    public ownership?: string,
    public budget?: number,
    public ceiling?: number,
    public completion?: number,
    public status?: string
  ) {}
}
