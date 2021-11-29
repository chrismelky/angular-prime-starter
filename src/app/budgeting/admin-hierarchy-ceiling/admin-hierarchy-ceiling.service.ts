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

  createAdminCeilingDocs(
    docs: any
  ): Observable<CustomResponse<any>> {
    let url = "api/admin_hierarchy_ceiling_docs_store";
    return this.http.post<CustomResponse<any>>(
      url,
      docs
    );
  }

  initiateCeiling(
    adminHierarchyCeiling: AdminHierarchyCeiling
  ): Observable<CustomResponse<AdminHierarchyCeiling>> {
    const url = 'api/initiate_ceiling';
    return this.http.post<CustomResponse<AdminHierarchyCeiling>>(
      url,
      adminHierarchyCeiling
    );
  }

  projectionAllocation(
    payload: any
  ): Observable<CustomResponse<any>> {
    const url = 'api/initiate_projection_ceiling';
    return this.http.post<CustomResponse<any>>(
      url,
      payload
    );
  }

  lockOrUnlockCeiling(
    payload: any
  ): Observable<CustomResponse<AdminHierarchyCeiling>> {
    const url = 'api/lock_unlock_ceiling';
    return this.http.post<CustomResponse<any>>(
      url,
      payload
    );
  }

  getCeilingLockUnlockSummary(req?: any): Observable<CustomResponse<any[]>> {
    const options = createRequestOption(req);
    const url = 'api/ceiling_lock_summary';
    return this.http.get<CustomResponse<any[]>>(
      url,
      { params: options }
    );
  }

  ceilingDocsByAdminHierarchies(payload?: any): Observable<CustomResponse<any[]>> {
    const url = 'api/admin_hierarchy_ceiling_docs_by_admin_hierarchies';
    return this.http.post<CustomResponse<any[]>>(
      url,
      payload
    );
  }

  createNewCeilingDocs(
    payload: any
  ): Observable<CustomResponse<any>> {
    const url = 'api/admin_hierarchy_ceiling_docs_create';
    return this.http.post<CustomResponse<any>>(
      url,
      payload
    );
  }

  download(id: number) {
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
    };
    let url ='api/admin_hierarchy_ceiling_docs'
    return this.http.get<any>(
      `${url}/download/${id}`,
      httpOptions
    );
  }

  ceilingBudgetTypeAttachment(req?: any): Observable<CustomResponse<any[]>> {
    const options = createRequestOption(req);
    const url = 'api/admin_hierarchy_ceiling_docs';
    return this.http.get<CustomResponse<any[]>>(
      url,
      { params: options }
    );
  }

  getCeilingAllocationSummary(req?: any): Observable<CustomResponse<any[]>> {
    const options = createRequestOption(req);
    const url = 'api/ceiling_allocation_summary';
    return this.http.get<CustomResponse<any[]>>(
      url,
      { params: options }
    );
  }

  ceilingByFundSource(payload?: any): Observable<CustomResponse<any[]>> {
    const url = 'api/ceiling_by_fund_source';
    return this.http.post<CustomResponse<any[]>>(
      url,
      payload
    );
  }

  ceilingByPosition(
    positions: any
  ): Observable<CustomResponse<any>> {
    const url = 'api/ceiling_by_positions';
    return this.http.post<CustomResponse<any>>(
      url,
      positions
    );
  }


  ceilingStartPosition(): Observable<CustomResponse<any>> {
    const url = 'api/ceiling_start_position';
    return this.http.get<CustomResponse<any>>(
      url
    );
  }

  ceilingStartSectionPosition(): Observable<CustomResponse<any>> {
    const url = 'api/ceiling_start_section_position';
    return this.http.get<CustomResponse<any>>(
      url
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


  queryTotalAllocatedAmount(req?: any){
    const options = createRequestOption(req);
    const url = 'api/admin_ceiling_allocated_amount'
    return this.http.get<any>(
      url,
      {params: options}
    ).toPromise();
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  deleteCeilingDocs(id: number): Observable<CustomResponse<null>> {
    let url = "api/admin_hierarchy_ceiling_docs";
    return this.http.delete<CustomResponse<null>>(`${url}/${id}`);
  }
}
