import { NationalReference } from '../national-reference/national-reference.model';

export class ReferenceType {
  constructor(
    public id?: number,
    public name?: string,
    public multi_select?: string,
    public link_level?: string,
    public sector_id?: number,
    public references?: NationalReference[]
  ) {}
}
