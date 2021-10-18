import {GfsCode} from "../gfs-code/gfs-code.model";

export class BankAccount {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public gfs_code_id?: number,
    public gfs_code?: GfsCode) {
  }
}
