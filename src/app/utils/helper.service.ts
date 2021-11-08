import { Injectable } from '@angular/core';
import { AdminHierarchyCostCentre } from '../planning/admin-hierarchy-cost-centres/admin-hierarchy-cost-centre.model';
import { DecisionLevel } from '../setup/decision-level/decision-level.model';

@Injectable({ providedIn: 'root' })
export class HelperService {
  constructor() {}

  buildFilter(filter: any): any {
    const obj = { ...filter };
    Object.keys(obj).forEach((key) => (!obj[key] ? delete obj[key] : {}));
    return obj;
  }

  groupBy(arr: any[], column: string) {
    const newObj = arr.reduce(function (acc, currentValue) {
      if (!acc[currentValue[column]]) {
        acc[currentValue[column]] = [];
      }
      acc[currentValue[column]].push(currentValue);
      return acc;
    }, {});
    return Object.keys(newObj).map((k) => {
      return {
        name: k,
        values: newObj[k],
      };
    });
  }

  getDecionLevel(
    budgeType: string,
    adminHierarchyCostCentre: AdminHierarchyCostCentre
  ): DecisionLevel | undefined {
    switch (budgeType) {
      case 'CURRENT':
        return adminHierarchyCostCentre.current_budget_decision_level;
      case 'APPROVED':
        return adminHierarchyCostCentre.current_budget_decision_level;
      case 'CARRYOVER':
        return adminHierarchyCostCentre.carryover_budget_decision_level;
      case 'SUPPLEMENTARY':
        return adminHierarchyCostCentre.supplementary_budget_decision_level;
      default:
        return undefined;
    }
  }
}
