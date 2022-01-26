import { DataSet } from '../data-set/data-set.model';
import { ReportSetup } from '../report-setup/report-setup.model';

export class CasPlanContent {
  constructor(
    public id?: number,
    public name?: string,
    public parent_id?: number,
    public report_id?: number,
    public cas_plan_id?: number,
    public is_file?: boolean,
    public children?: CasPlanContent[],
    public sort_order?: number,
    public data_sets?: DataSet[],
    public report?: ReportSetup
  ) {}
}
