/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {createRequestOption} from "../../utils/request-util";
import {CustomResponse} from "../../utils/custom-response";
import {ReferenceDocumentType} from "./reference-document-type.model";

@Injectable({providedIn: "root"})
export class ReferenceDocumentTypeService {
  public resourceUrl = "api/reference_document_types";

  constructor(protected http: HttpClient) {
  }

  create(
    referenceDocumentType: ReferenceDocumentType
  ): Observable<CustomResponse<ReferenceDocumentType>> {
    return this.http.post<CustomResponse<ReferenceDocumentType>>(
      this.resourceUrl,
      referenceDocumentType
    );
  }

  update(
    referenceDocumentType: ReferenceDocumentType
  ): Observable<CustomResponse<ReferenceDocumentType>> {
    return this.http.put<CustomResponse<ReferenceDocumentType>>(
      `${this.resourceUrl}/${referenceDocumentType.id}`,
      referenceDocumentType
    );
  }

  find(id: number): Observable<CustomResponse<ReferenceDocumentType>> {
    return this.http.get<CustomResponse<ReferenceDocumentType>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ReferenceDocumentType[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ReferenceDocumentType[]>>(
      this.resourceUrl,
      {params: options}
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
