import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {createRequestOption} from "../../utils/request-util";
import {CustomResponse} from "../../utils/custom-response";
import {DecisionLevel} from "./decision-level.model";

@Injectable({providedIn: "root"})
export class DecisionLevelService {
  public resourceUrl = "api/decision_levels";

  constructor(protected http: HttpClient) {
  }

  create(decisionLevel: DecisionLevel): Observable<CustomResponse<DecisionLevel>> {
    return this.http.post<CustomResponse<DecisionLevel>>(this.resourceUrl, decisionLevel);
  }

  update(
    decisionLevel: DecisionLevel
  ): Observable<CustomResponse<DecisionLevel>> {
    return this.http.put<CustomResponse<DecisionLevel>>(
      `${this.resourceUrl}/${decisionLevel.id}`,
      decisionLevel
    );
  }

  find(id: number): Observable<CustomResponse<DecisionLevel>> {
    return this.http.get<CustomResponse<DecisionLevel>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<DecisionLevel[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<DecisionLevel[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
