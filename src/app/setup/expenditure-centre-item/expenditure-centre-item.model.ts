import { GfsCode } from '../gfs-code/gfs-code.model';

export class ExpenditureCentreItem {
  constructor(
    public id?: number,
    public name?: string,
    public percentage?: string,
    public expenditure_centre_id?: number,
    public gfs_codes: GfsCode[] = [],
    public actual_budget?: number,
    public actual_percentage?: number
  ) {}
}
