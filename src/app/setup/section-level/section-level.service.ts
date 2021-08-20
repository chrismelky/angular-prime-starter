import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { createRequestOption } from "../../utils/request-util";
import { CustomResponse } from "../../utils/custom-response";
import { SectionLevel } from "./section-level.model";

@Injectable({ providedIn: "root" })
export class SectionLevelService {
  public resourceUrl = "api/section_levels";

  constructor(protected http: HttpClient) {}

  create(sectionLevel: SectionLevel): Observable<CustomResponse<SectionLevel>> {
    return this.http.post<CustomResponse<SectionLevel>>(
      this.resourceUrl,
      sectionLevel
    );
  }

  update(sectionLevel: SectionLevel): Observable<CustomResponse<SectionLevel>> {
    return this.http.put<CustomResponse<SectionLevel>>(
      `${this.resourceUrl}/${sectionLevel.id}`,
      sectionLevel
    );
  }

  find(id: number): Observable<CustomResponse<SectionLevel>> {
    return this.http.get<CustomResponse<SectionLevel>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<SectionLevel[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<SectionLevel[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
