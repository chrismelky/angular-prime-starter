import {FundSource} from "../fund-source/fund-source.model";
import {Project} from "../project/project.model";

export class ProjectFundSource {
  constructor(
    public id?: number,
    public project_id?: number,
    public project?: Project,
    public fund_source_id?: number,
    public fund_source?: FundSource,
  ) {
  }
}

export class CreateProjectFundSource {
  constructor(
    public project_id?: number,
    public fund_sources?: FundSource[]
  ) {
  }
}

