import {Sector} from "../sector/sector.model";
import {Project} from "../project/project.model";

export class ProjectSector {
  constructor(
    public id?: number,
    public project_id?: number,
    public project?: Project,
    public sector_id?: number,
    public sector?: Sector,
  ) {}
}

export class CreateProjectSector {
  constructor(
    public project_id?: number,
    public sectors?: Sector[]
  ) {}
}

