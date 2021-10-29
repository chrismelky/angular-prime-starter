import {Section} from "../../setup/section/section.model";
import {SectionLevel} from "../../setup/section-level/section-level.model";

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
    public percent?: number,
    public amount?: number,
    public deleted?: boolean,
    public is_facility?:any,
    public facility_id?:any,
    public allocatedAmount?:any,
  ) {}
}
