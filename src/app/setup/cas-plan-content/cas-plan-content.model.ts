export class CasPlanContent {
  constructor(
    public id?: number,
    public name?: string,
    public parent_id?: number,
    public report_id?: number,
    public cas_plan_id?: number,
    public is_file?: boolean,
    public children?: CasPlanContent[],
    public sort_order?: number
  ) {}
}
