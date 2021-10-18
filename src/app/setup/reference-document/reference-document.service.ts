/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Injectable } from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import { Observable } from "rxjs";

import { createRequestOption } from "../../utils/request-util";
import { CustomResponse } from "../../utils/custom-response";
import { ReferenceDocument } from "./reference-document.model";

@Injectable({ providedIn: "root" })
export class ReferenceDocumentService {
  public resourceUrl = "api/reference_documents";
  public downloadUrl = "api/download_document";

  constructor(protected http: HttpClient) {}

  create(
    referenceDocument: FormData
  ): Observable<CustomResponse<ReferenceDocument>> {
    return this.http.post<CustomResponse<ReferenceDocument>>(
      this.resourceUrl,
      referenceDocument
    );
  }

    update(
        referenceDocument: FormData
    ): Observable<CustomResponse<ReferenceDocument>> {
    return this.http.put<CustomResponse<ReferenceDocument>>(
      `${this.resourceUrl}/${referenceDocument.get('id')}`,
      referenceDocument
    );
  }

  find(id: number): Observable<CustomResponse<ReferenceDocument>> {
    return this.http.get<CustomResponse<ReferenceDocument>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ReferenceDocument[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ReferenceDocument[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  fileDownload(id: number){
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    };
    return this.http.get<any>(
      `${this.downloadUrl}/${id}`,httpOptions
    )
  }
}
