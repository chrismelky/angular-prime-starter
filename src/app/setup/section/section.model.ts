export class Section {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public sector_id?: number,
    public section_level_id?: number,
    public parent_id?: number
  ) {}
}
