import {AdminHierarchyLevel} from "../admin-hierarchy-level/admin-hierarchy-level.model";

export class Role {
  constructor(
    public id?: number,
    public name?: string,
    public active?: string,
    public admin_hierarchy_position?: number,
    public level?: AdminHierarchyLevel,
  ) {
  }
}
