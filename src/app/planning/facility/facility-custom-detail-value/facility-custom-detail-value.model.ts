import {Facility} from "../../../setup/facility/facility.model";

export class FacilityCustomDetailValue {
  constructor(
    public id?: number,
    public facility_custom_detail_id?: number,
    public facility_id?: number,
    public facility?: Facility,
    public value?: string
  ) {}
}
