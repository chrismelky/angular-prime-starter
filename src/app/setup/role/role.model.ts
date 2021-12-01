import {AdminHierarchyLevel} from "../admin-hierarchy-level/admin-hierarchy-level.model";
import {SectionLevel} from "../section-level/section-level.model";

export class Role {
  constructor(
    public id?: number,
    public name?: string,
    public active?: string,
    public admin_hierarchy_position?: number,
    public level?: AdminHierarchyLevel,
    public section_level?: SectionLevel,
    public section_position?: number,
  ) {
  }
}
