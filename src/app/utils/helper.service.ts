import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HelperService {
  constructor() {}

  buildFilter(filter: any): any {
    const obj = { ...filter };
    Object.keys(obj).forEach((key) => (!obj[key] ? delete obj[key] : {}));
    return obj;
  }
}
