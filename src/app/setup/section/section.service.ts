import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { createRequestOption } from "../../utils/request-util";
import { CustomResponse } from "../../utils/custom-response";
import { Section } from "./section.model";

@Injectable({ providedIn: "root" })
export class SectionService {
  public resourceUrl = "api/sections";

  constructor(protected http: HttpClient) {}

  create(section: Section): Observable<CustomResponse<Section>> {
    return this.http.post<CustomResponse<Section>>(this.resourceUrl, section);
  }

  update(section: Section): Observable<CustomResponse<Section>> {
    return this.http.put<CustomResponse<Section>>(
      `${this.resourceUrl}/${section.id}`,
      section
    );
  }

  find(id: number): Observable<CustomResponse<Section>> {
    return this.http.get<CustomResponse<Section>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Section[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Section[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
