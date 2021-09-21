import {Section} from "../section/section.model";
import {SectionLevel} from "../section-level/section-level.model";

export class AdminHierarchyCeiling {
  constructor(
    public id?: number,
    public ceiling_id?: number,
    public ceiling?: any,
    public admin_hierarchy_id?: number,
    public financial_year_id?: number,
    public parent_id?: any,
    public section_id?: number,
    public section?:Section,
    public active?: boolean,
    public is_locked?: boolean,
    public is_approved?: boolean,
    public budget_type?: string,
    public amount?: number,
    public deleted?: boolean,
    public is_facility?:boolean,
  ) {}
}
