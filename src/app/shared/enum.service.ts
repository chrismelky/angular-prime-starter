import { Injectable } from '@angular/core';

export interface PlanrepEnum {
  display: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnumService {
  enums: any = {
    ownership: [
      {
        display: 'Private',
        value: 'Private',
      },
      {
        display: 'Public',
        value: 'Public',
      },
    ],
    // ===enum hooks===
  };
  constructor() {}

  get(key: string): PlanrepEnum[] {
    return this.enums[key] ?? [];
  }
}
