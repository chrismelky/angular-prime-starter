import {SectionLevel} from "../section-level/section-level.model";

export class Section {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public sector_id?: number,
    public position?: number,
    public section_level?:SectionLevel,
    public parent_id?: number
  ) {}
}
