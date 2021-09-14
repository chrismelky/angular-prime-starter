import {AdminHierarchy} from '../admin-hierarchy/admin-hierarchy.model';
import {Section} from '../section/section.model';

export class User {
  constructor(
    public id?: number,
    public first_name?: string,
    public last_name?: string,
    public email?: string,
    public cheque_number?: string,
    public activated?: string,
    public title?: string,
    public mobile_number?: string,
    public section_id?: number,
    public admin_hierarchy_id?: number,
    public facilities?: string,
    public is_facility_user?: string,
    public is_super_user?: string,
    public admin_hierarchy?: AdminHierarchy,
    public section?: Section,
    public username?: string
  ) {
  }
}
