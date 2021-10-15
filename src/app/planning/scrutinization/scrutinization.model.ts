import {GfsCode} from "../../setup/gfs-code/gfs-code.model";

export class Scrutinization {
  constructor(
    public id?: number,
    public admin_hierarchy_id?: number,
    public section_id?: number,
    public code?: string,
    public name?: string,
    public budget?: number,
    public status?: number,
    public expenditure?: number,
    public balance?: number,
    public comments?: string,
    public inputs? : [{
      id: number,
      name: string,
      status: number,
      code: string,
      amount: number
    }]
  ) {}
}
