import { ExpenditureCentreItem } from '../expenditure-centre-item/expenditure-centre-item.model';
import { FundSource } from '../fund-source/fund-source.model';
import { Sector } from '../sector/sector.model';

export class ExpenditureCentre {
  constructor(
    public id?: number,
    public name?: string,
    public percentage?: string,
    public fund_sources: FundSource[] = [],
    public sectors: Sector[] = [],
    public actual_budget?: number,
    public actual_percentage?: number,
    public items: ExpenditureCentreItem[] = []
  ) {}
}
