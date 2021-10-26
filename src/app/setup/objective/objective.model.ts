import { FinancialYearTarget } from 'src/app/planning/long-term-target/financial-year-target.model';
import { Sector } from '../sector/sector.model';

export class Objective {
  constructor(
    public id?: number,
    public description?: string,
    public code?: string,
    public objective_type_id?: number,
    public parent_id?: number,
    public children?: Objective[],
    public sectors?: Sector[]
  ) {}
}

export class ObjectiveWithTarget extends Objective {
  public targets?: FinancialYearTarget[] = [];
}
