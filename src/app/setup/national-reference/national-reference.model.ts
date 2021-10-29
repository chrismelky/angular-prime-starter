import { Sector } from '../sector/sector.model';

export class NationalReference {
  constructor(
    public id?: number,
    public code?: string,
    public description?: string,
    public reference_type_id?: number,
    public parent_id?: number,
    public link_level?: string,
    public active?: boolean,
    public sectors?: Sector[],
    public parent?: NationalReference
  ) {}
}
