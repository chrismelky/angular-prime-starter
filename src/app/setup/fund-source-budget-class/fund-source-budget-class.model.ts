import {BudgetClass} from "../budget-class/budget-class.model";

export class FundSourceBudgetClass {
  constructor(
    public id?: number,
    public ceiling_name?: string,
    public budget_class_id?: number,
    public fund_source_id?: number,
    public fund_type_id?: number,
    public bank_account_id?: number,
    public budget_class?: BudgetClass,
    public facility_types?: any,
    public is_active?: any,
    public is_pe?: any
  ) {}
}
