import { AdminHierarchy } from '../admin-hierarchy/admin-hierarchy.model';
import { Section } from '../section/section.model';
import { Role } from '../role/role.model';

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
    public section_position?: number,
    public admin_hierarchy_id?: number,
    public facilities?: string,
    public is_facility_user?: boolean,
    public facility_id?: number,
    public is_super_user?: boolean,
    public has_facility_limit?: boolean,
    public admin_hierarchy?: AdminHierarchy,
    public section?: Section,
    public active?: boolean,
    public roles?: Role[]
  ) {}
}
