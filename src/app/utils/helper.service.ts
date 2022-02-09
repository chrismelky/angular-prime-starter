import { Injectable } from '@angular/core';

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
}
