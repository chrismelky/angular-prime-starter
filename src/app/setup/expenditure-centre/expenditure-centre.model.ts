import { FundSource } from '../fund-source/fund-source.model';
import { Sector } from '../sector/sector.model';

export class ExpenditureCentre {
  constructor(
    public id?: number,
    public name?: string,
    public percentage?: string,
    public fund_sources: FundSource[] = [],
    public sectors: Sector[] = []
  ) {}
}
