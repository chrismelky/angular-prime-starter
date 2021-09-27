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
import { CeilingChain } from "./ceiling-chain.model";
import {Section} from "../section/section.model";
import {AdminHierarchyLevel} from "../admin-hierarchy-level/admin-hierarchy-level.model";

@Injectable({ providedIn: "root" })
export class CeilingChainService {
  public resourceUrl = "api/ceiling_chains";

  constructor(protected http: HttpClient) {}

  create(ceilingChain: CeilingChain): Observable<CustomResponse<CeilingChain>> {
    return this.http.post<CustomResponse<CeilingChain>>(
      this.resourceUrl,
      ceilingChain
    );
  }

  update(ceilingChain: CeilingChain): Observable<CustomResponse<CeilingChain>> {
    return this.http.put<CustomResponse<CeilingChain>>(
      `${this.resourceUrl}/${ceilingChain.id}`,
      ceilingChain
    );
  }

  find(id: number): Observable<CustomResponse<CeilingChain>> {
    return this.http.get<CustomResponse<CeilingChain>>(
      `${this.resourceUrl}/${id}`
    );
  }

  queryWithChild(req?: any): Observable<CustomResponse<CeilingChain[]>> {
    const options = createRequestOption(req);
    const url = 'api/ceiling_chain_with_children';
    return this.http.get<CustomResponse<CeilingChain[]>>(url, {
      params: options,
    });
  }
  ceilingSectionLevels(req?: any): Observable<CustomResponse<Section[]>> {
    const options = createRequestOption(req);
    const url = 'api/ceiling_section_levels';
    return this.http.get<CustomResponse<Section[]>>(url, {
      params: options,
    });
  }
  ceilingHierarchyLevels(req?: any): Observable<CustomResponse<AdminHierarchyLevel[]>> {
    const options = createRequestOption(req);
    const url = 'api/ceiling_hierarchy_levels';
    return this.http.get<CustomResponse<AdminHierarchyLevel[]>>(url, {
      params: options,
    });
  }

  query(req?: any): Observable<CustomResponse<CeilingChain[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<CeilingChain[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
