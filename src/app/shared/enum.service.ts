import { Injectable } from "@angular/core";

export interface PlanrepEnum {
  display: string;
  value: string;
}

@Injectable({
  providedIn: "root",
})
export class EnumService {
  enums: any = {
    ownership: [
      {
        display: "Private",
        value: "Private",
      },
      {
        display: "Public",
        value: "Public",
      },
    ],
    linkLevels: [
      {
        display: "Activity",
        value: "Activity",
      },
      {
        display: "Target",
        value: "Target",
      },
    ],
    financialYearTypes: [
      {
        display: "Activity",
        value: "Activity",
      },
      {
        display: "Target",
        value: "Target",
      },
    ],
    periodTypes: [
      {
        display: "Quarterly",
        value: "Quarterly",
      },
      {
        display: "Financial Year",
        value: "Financial Year",
      },
    ],
    contentTypes: [
      {
        display: "CAS",
        value: "CAS",
      },
      {
        display: "PROJECT",
        value: "PROJECT",
      },
      {
        display: "DATA FORM",
        value: "DATA FORM",
      },
    ],
    /**====Planrep Enum Generator Hook: Dont Delete====*/
  };

  constructor() {}

  get(key: string): PlanrepEnum[] {
    return this.enums[key] ?? [];
  }
}
