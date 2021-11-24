import { Sector } from '../sector/sector.model';

export class GenericPriority {
  constructor(
    public id?: number,
    public description?: string,
    public params?: string,
    public planning_matrix_id?: number,
    public is_active: boolean = true,
    public sectors: Sector[] = []
  ) {}
}
