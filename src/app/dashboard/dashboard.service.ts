import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomResponse } from '../utils/custom-response';
import { createRequestOption } from '../utils/request-util';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public resourceUrl = 'api/dashboards';

  constructor(protected http: HttpClient) {}

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
