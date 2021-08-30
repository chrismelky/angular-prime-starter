export class FundType {
  constructor(
    public id?: number,
    public name?: string,
    public current_budget_code?: string,
    public carry_over_budget_code?: string,
    public is_active?: string
  ) {}
}
