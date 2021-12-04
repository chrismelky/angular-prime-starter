import {Section} from "../../section/section.model";

export class GfsCodeSection {
  constructor(
    public id?: number,
    public gfs_code_id?: number,
    public section_id?: number
  ) {}
}

export class CreateGfsCodeSection {
  constructor(
    public gfs_code_id?: number,
    public sections?: Section[]
  ) {
  }
}

