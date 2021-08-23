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
      {
        display: "Integer, Zero or Positive",
        value: "INTEGER_ZERO_OR_POSITIVE",
      },
    ],
    /**====Planrep Enum Generator Hook: Dont Delete====*/
  };

  constructor() {}

  get(key: string): PlanrepEnum[] {
    return this.enums[key] ?? [];
  }
}
