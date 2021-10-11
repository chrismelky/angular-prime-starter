import { SectorProblem } from 'src/app/planning/sector-problem/sector-problem.model';
import { Intervention } from '../intervention/intervention.model';
import { Objective } from '../objective/objective.model';
import { Sector } from '../sector/sector.model';

export class PriorityArea {
  constructor(
    public id?: number,
    public description?: string,
    public number?: number,
    public objectives?: Objective[],
    public sectors?: Sector[],
    public interventions: Intervention[] = [],
    public sector_problems: SectorProblem[] = []
  ) {}
}
