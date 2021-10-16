import {GfsCode} from "../gfs-code/gfs-code.model";

export class FundSource {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public gfs_code?: GfsCode,
    public gfs_code_id?: number,
    public fund_source_category_id?: number,
    public is_conditional?: string,
    public is_foreign?: string,
    public is_treasurer?: string,
    public can_project?: string,
    public is_active?: string,
    public sectors?: any
  ) {}
}
