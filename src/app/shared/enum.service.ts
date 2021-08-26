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
    valueTypes: [
      { display: "Number", value: "NUMBER" },
      { display: "Username", value: "USERNAME" },
      { display: "Positive Integer", value: "POSITIVE_INTEGER" },
      { display: "Negative Integer", value: "NEGATIVE_INTEGER" },
      { display: "Coordinate", value: "COORDNATE" },
      { display: "File", value: "FILE" },
      { display: "URL", value: "URL" },
      { display: "Boolean", value: "BOOLEAN" },
      { display: "Text", value: "TEXT" },
      { display: "Email", value: "EMAIL" },
      { display: "Date", value: "DATE" },
      { display: "Time", value: "TIME" },
      { display: "Phone Number", value: "PHONE_NUMBER" },
      { display: "Long Text", value: "LONG_TEXT" },
      { display: "Percent", value: "PERCENT" },
      { display: "Integer", value: "INTEGER" },
      {display: "Integer, Zero or Positive", value: "INTEGER_ZERO_OR_POSITIVE"},
    ],
    //'PR', 'PU', 'FB', 'DE', 'PA', 'PO'
    ownerships: [
      {display: "Private", value: "PR"},
      {display: "Public", value: "PU"},
      {display: "Faith Based", value: "FB"},
      {display: "Defence", value: "DE"},
      {display: "Parastatal", value: "PA"},
      {display: "Public Other", value: "PO"},
    ],
    physicalStates: [
      {display: "Good", value: "A"},
      {display: "Minor Rehabilitation needed", value: "B"},
      {display: "Major Rehabilitation needed", value: "C"},
      {display: "Demolition and reconstruction", value: "D"},
      {display: "Under construction", value: "E"},
      {display: "Under minor rehabilitation", value: "F"},
      {display: "Very poor", value: "G"},
      {display: "Under extension", value: "H"},
      {display: "Under major rehabilitation", value: "M"},
      {display: "Planned for construction", value: "P"},
      {display: "Extension needed", value: "X"},
    ],
    starRatings: [
      {display: "Zero", value: "0"},
      {display: "1 Star", value: "1"},
      {display: "2 Stars", value: "2"},
      {display: "3 Stars", value: "3"},
      {display: "4 Stars", value: "4"},
      {display: "5 Stars", value: "5"},
    ],
    /**====Planrep Enum Generator Hook: Dont Delete====*/
  };

  constructor() {}

  get(key: string): PlanrepEnum[] {
    return this.enums[key] ?? [];
  }
}
