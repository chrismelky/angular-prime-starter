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
    htmlInputTypes: [
      { display: "Text", value: "TEXT" },
      { display: "Number", value: "NUMBER" },
      { display: "Select", value: "SELECT" },
      { display: "Mult Select", value: "MULT_SELECT" },
    ],
    valueTypes: [
      { display: "Number", value: "NUMBER" },
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
      { display: "Long Text", value: "LONG_TEXT" },
      { display: "Percent", value: "PERCENT" },
      { display: "Integer", value: "INTEGER" },
    ],
    ownerships: [
      { display: "Private", value: "PR" },
      { display: "Public", value: "PU" },
      { display: "Faith Based", value: "FB" },
      { display: "Defence", value: "DE" },
      { display: "Parastatal", value: "PA" },
      { display: "Public Other", value: "PO" },
    ],
    insuranceTypes: [
      {
        display: "A. Insured comprehensive",
        value: "A. Insured comprehensive",
      },
      { display: "B. Insured 3rd party", value: "B. Insured 3rd party" },
      { display: "C. Not insured", value: "C. Not insured" },
      { display: "D. Not Applicable", value: "D. Not Applicable" },
    ],
    physicalStates: [
      { display: "Good", value: "A" },
      { display: "Minor Rehabilitation needed", value: "B" },
      { display: "Major Rehabilitation needed", value: "C" },
      { display: "Demolition and reconstruction", value: "D" },
      { display: "Under construction", value: "E" },
      { display: "Under minor rehabilitation", value: "F" },
      { display: "Very poor", value: "G" },
      { display: "Under extension", value: "H" },
      { display: "Under major rehabilitation", value: "M" },
      { display: "Planned for construction", value: "P" },
      { display: "Extension needed", value: "X" },
    ],
    starRatings: [
      { display: "Zero", value: "0" },
      { display: "1 Star", value: "1" },
      { display: "2 Stars", value: "2" },
      { display: "3 Stars", value: "3" },
      { display: "4 Stars", value: "4" },
      { display: "5 Stars", value: "5" },
    ],

    units: [
      { display: "Allowance", value: "Allowance" },
      { display: "Annually", value: "Annually" },
      { display: "Kilogram", value: "Kilogram" },
      { display: "Lumpsum", value: "Lumpsum" },
      { display: "Kilometer", value: "Kilometer" },
      { display: "Quarterly", value: "Quarterly" },
      { display: "Unit", value: "Unit" },
      { display: "Litres", value: "Litres" },
      { display: "Packet", value: "Packet" },
      { display: "Month", value: "Month" },
      { display: "Box", value: "Box" },
      { display: "Book", value: "Book" },
      { display: "Metre", value: "Metre" },
      { display: "Bottle", value: "Bottle" },
      { display: "Carton", value: "Carton" },
      { display: "Dozen", value: "Dozen" },
      { display: "Each", value: "Each" },
      { display: "Hour", value: "Hour" },
      { display: "Inch", value: "Inch" },
      { display: "Piece", value: "Piece" },
      { display: "Piece", value: "Piece" },
      { display: "Set", value: "Set" },
      { display: "Set", value: "Set" },
      { display: "Ream", value: "Ream" },
      { display: "Pair", value: "Pair" },
      { display: "Pair", value: "Pair" },
      { display: "Sheet", value: "Sheet" },
      { display: "Person", value: "Person" },
      { display: "Person Days", value: "Person days" },
      { display: "Perdiem", value: "Perdiem" },
      { display: "Minute", value: "Minute" },
      { display: "Hour", value: "Hour" },
      { display: "Hour", value: "Hour" },
      { display: "Milliliter", value: "Milliliter" },
      { display: "Centimeter", value: "Centimeter" },
      { display: "Square", value: "Square" },
      { display: "Meter", value: "Meter" },
      { display: "Second", value: "second" },
      { display: "Milligram", value: "Milligram" },
      { display: "Gram", value: "Gram" },
      { display: "Chair", value: "Chair" },
      { display: "Pipes and fittings", value: "Pipes and fittings" },
      { display: "Conference facility", value: "Conference facility" },
      { display: "Classroom", value: "Classroom" },
      { display: "Body(ies)", value: "Body(ies)" },
      { display: "Venue", value: "Venue" },
      { display: "Drugs", value: "Drugs" },
      { display: "Parts", value: "Parts" },
      { display: "Parts", value: "Parts" },
      { display: "Semi Annually", value: "Semi Annually" },
      { display: "Weekly", value: "Weekly" },
      { display: "Days", value: "Days" },
      { display: "Number", value: "Number" },
      { display: "Roll", value: "Roll" },
      { display: "Hactare", value: "Hactare" },
      { display: "Kit", value: "kit" },
      { display: "Doses", value: "Doses" },
      { display: "Student", value: "student" },
      { display: "Pupil", value: "pupil" },
      { display: "Contract", value: "Contract" },
      { display: "Vehicle", value: "Vehicle" },
      { display: "bundle", value: "bundle" },
      { display: "Bag", value: "Bag" },
      { display: "Trip", value: "Trip" },
      { display: "Cubic Meter", value: "Cubic Meter" },
      { display: "Litter", value: "Litter" },
      { display: "Square kilometer", value: "Square kilometer" },
      { display: "Bill", value: "Bill" },
      { display: "Petrol", value: "Petrol" },
      { display: "Buildings", value: "Buildings" },
      { display: "Diesel", value: "Diesel" },
      { display: "Plate", value: "Plate" },
    ],
    types: [],
    gfsCodeCategoryTypes: [
      { display: "Category", value: "category" },
      { display: "Sub-Category", value: "sub_category" },
    ],
    lgaLevels: [
      { display: "Lower Local Government", value: "LLG" },
      { display: "Higher Local Government", value: "HLG" },
    ],
    periodGroups: [
      { display: "Quarter", value: "Quarter" },
      { display: "Month", value: "Month" },
      { display: "Annual", value: "Annual" },
    ],
    budgetTypes: [
      { display: "CURRENT", value: "CURRENT" },
      { display: "APPROVED", value: "APPROVED" },
      { display: "CARRYOVER", value: "CARRYOVER" },
      { display: "SUPPLEMENTARY", value: "SUPPLEMENTARY" },
    ],

    peOutPutValues: [
      { display: "Text", value: "TEXT" },
      { display: "Number", value: "NUMBER" },
      { display: "Currency", value: "CURRENCY" },
      { display: "Date", value: "DATE" },
    ],

    peInPutValues: [
      { display: "Number", value: "NUMBER" },
      {
        display: "Integer, Zero or Positive",
        value: "INTEGER_ZERO_OR_POSITIVE",
      },
      { display: "Currency", value: "CURRENCY" },
      { display: "Select", value: "SELECT" },
      { display: "Date", value: "DATE" },
      { display: "Text", value: "TEXT" },
    ],
    inputTypes: [
      { display: "Text", value: "text" },
      { display: "Number", value: "Number" },
      { display: "Boolean", value: "boolean" },
    ],
    balanceTypes: [
      { display: "Debit", value: "DEBIT" },
      { display: "Credit", value: "CREDIT" },
    ],

    projectDataFormInputType: [
      { display: "Text", value: "text" },
      { display: "Number", value: "number" },
      { display: "Date", value: "date" },
      { display: "Radio", value: "radio" },
      { display: "Check", value: "check" },
    ],
    /**====Planrep Enum Generator Hook: Dont Delete====*/
  };

  constructor() {}

  get(key: string): PlanrepEnum[] {
    return this.enums[key] ?? [];
  }
}
