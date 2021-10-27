import {FacilityCustomDetailOption} from "./facility-custom-detail-option/facility-custom-detail-option.model";

export class FacilityCustomDetail {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public value_type?: string,
    public options?: FacilityCustomDetailOption[]
  ) {
  }
}
