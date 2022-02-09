/**  * @license */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomResponse } from '../utils/custom-response';
import { createRequestOption } from '../utils/request-util';
import { BudgetCeiling } from './budget-ceiling.model';

@Injectable({ providedIn: 'root' })
export class BudgetCeilingService {
  public resourceUrl = 'api/budget_ceilings';

  constructor(protected http: HttpClient) {}

  create(
    budgetCeiling: BudgetCeiling
  ): Observable<CustomResponse<BudgetCeiling>> {
    return this.http.post<CustomResponse<BudgetCeiling>>(
      this.resourceUrl,
      budgetCeiling
    );
  }

  update(
    budgetCeiling: BudgetCeiling
  ): Observable<CustomResponse<BudgetCeiling>> {
    return this.http.put<CustomResponse<BudgetCeiling>>(
      `${this.resourceUrl}/${budgetCeiling.id}`,
      budgetCeiling
    );
  }

  find(id: number): Observable<CustomResponse<BudgetCeiling>> {
    return this.http.get<CustomResponse<BudgetCeiling>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<BudgetCeiling[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<BudgetCeiling[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
