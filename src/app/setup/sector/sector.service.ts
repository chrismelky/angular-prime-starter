import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { createRequestOption } from "../../utils/request-util";
import { CustomResponse } from "../../utils/custom-response";
import { Sector } from "./sector.model";

@Injectable({ providedIn: "root" })
export class SectorService {
  public resourceUrl = "api/sectors";

  constructor(protected http: HttpClient) {}

  create(sector: Sector): Observable<CustomResponse<Sector>> {
    return this.http.post<CustomResponse<Sector>>(this.resourceUrl, sector);
  }

  update(sector: Sector): Observable<CustomResponse<Sector>> {
    return this.http.put<CustomResponse<Sector>>(
      `${this.resourceUrl}/${sector.id}`,
      sector
    );
  }

  find(id: number): Observable<CustomResponse<Sector>> {
    return this.http.get<CustomResponse<Sector>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Sector[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Sector[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
