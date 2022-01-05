import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomResponse } from '../utils/custom-response';
import { createRequestOption } from '../utils/request-util';
import { CeilingBudgetRevenueExpenditure } from './dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public resourceUrl = 'api/dashboards';

  constructor(protected http: HttpClient) {}

  ceilingBudgetRevenueExpenditure(
    req: any
  ): Observable<CustomResponse<CeilingBudgetRevenueExpenditure>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CeilingBudgetRevenueExpenditure>>(
      `${this.resourceUrl}/ceiling_budget_revenue_expenditure`,
      {
        params: options,
      }
    );
  }

  fundSourceCeilingAndBudget(req: any): Observable<CustomResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<any>>(
      `${this.resourceUrl}/fund_source_ceiling_and_budget`,
      {
        params: options,
      }
    );
  }
}
