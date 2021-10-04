import { Section } from '../section/section.model';

export class FacilityType {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public lga_level?: string,
    public admin_hierarchy_level_id?: number,
    public sections?: Section[]
  ) {}
}
