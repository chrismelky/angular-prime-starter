/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { createRequestOption } from "../../utils/request-util";
import { CustomResponse } from "../../utils/custom-response";
import { AdminHierarchyCeiling } from "./admin-hierarchy-ceiling.model";

@Injectable({ providedIn: "root" })
export class AdminHierarchyCeilingService {
  public resourceUrl = "api/admin_hierarchy_ceilings";

  constructor(protected http: HttpClient) {}

  create(
    adminHierarchyCeiling: AdminHierarchyCeiling
  ): Observable<CustomResponse<AdminHierarchyCeiling>> {
    return this.http.post<CustomResponse<AdminHierarchyCeiling>>(
      this.resourceUrl,
      adminHierarchyCeiling
    );
  }

  update(
    adminHierarchyCeiling: AdminHierarchyCeiling
  ): Observable<CustomResponse<AdminHierarchyCeiling>> {
    return this.http.put<CustomResponse<AdminHierarchyCeiling>>(
      `${this.resourceUrl}/${adminHierarchyCeiling.id}`,
      adminHierarchyCeiling
    );
  }

  uploadCeiling(
    ceiling: any
  ): Observable<CustomResponse<any>> {
    const url = 'api/upload_ceiling';
    return this.http.post<CustomResponse<any>>(
      url,
      ceiling
    );
  }

  find(id: number): Observable<CustomResponse<AdminHierarchyCeiling>> {
    return this.http.get<CustomResponse<AdminHierarchyCeiling>>(
      `${this.resourceUrl}/${id}`
    );
  }


  query(req?: any): Observable<CustomResponse<AdminHierarchyCeiling[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AdminHierarchyCeiling[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  queryDownloadTemplate(req?: any): any {
    const options = createRequestOption(req);
    const url = "api/download_template";
    return this.http.get(
      url,
      { params: options ,  responseType: 'arraybuffer'}

    );
  }

  queryCeilingWithChildren(req?: any): Observable<CustomResponse<AdminHierarchyCeiling[]>> {
    const options = createRequestOption(req);
    const url = 'api/admin_ceilings_children'
    return this.http.get<CustomResponse<AdminHierarchyCeiling[]>>(
      url,
      { params: options }
    );
  }


  queryCeilingBylevel(req?: any): Observable<CustomResponse<AdminHierarchyCeiling[]>> {
    const options = createRequestOption(req);
    const url = 'api/admin_ceilings_level'
    return this.http.get<CustomResponse<AdminHierarchyCeiling[]>>(
      url,
      { params: options }
    );
  }

  queryTotalAllocatedAmount(req?: any): Observable<CustomResponse<AdminHierarchyCeiling[]>> {
    const options = createRequestOption(req);
    const url = 'api/admin_ceiling_allocated_amount'
    return this.http.get<CustomResponse<AdminHierarchyCeiling[]>>(
      url,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
