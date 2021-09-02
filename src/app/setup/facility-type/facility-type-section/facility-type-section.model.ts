import {FacilityType} from "../facility-type.model";
import {Section} from "../../section/section.model";

export class FacilityTypeSection {
  constructor(
    public id?: number,
    public facility_type_id?: number,
    public facility_type?: FacilityType,
    public section_id?: number,
    public section?: Section
  ) {
  }
}
export class CreateFacilityTypeSection {
  constructor(
    public facility_type_id?: number,
    public sections?: Section[]
  ) {
  }
}

