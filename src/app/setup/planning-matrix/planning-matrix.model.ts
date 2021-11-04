import {NationalReference} from "../national-reference/national-reference.model";

export class PlanningMatrix {
  constructor(
    public id?: number,
    public name?: string,
    public national_reference_id?: number,
    public national_reference?: NationalReference,
  ) {}
}
