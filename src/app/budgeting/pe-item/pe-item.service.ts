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
import { PeItem } from "./pe-item.model";

@Injectable({ providedIn: "root" })
export class PeItemService {
 // public resourceUrl = "api/pe_items";
  public resourceUrl = "api/pe_lines";

  constructor(protected http: HttpClient) {}


  create(payload: any): Observable<CustomResponse<any>> {
    return this.http.post<CustomResponse<any>>(this.resourceUrl, payload);
  }


  update(peItem: PeItem): Observable<CustomResponse<PeItem>> {
    return this.http.put<CustomResponse<PeItem>>(
      `${this.resourceUrl}/${peItem}`,
      peItem
    );
  }

  find(id: number): Observable<CustomResponse<PeItem>> {
    return this.http.get<CustomResponse<PeItem>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<PeItem[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<PeItem[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  fetchDataValues(req?: any): Observable<CustomResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<any>>(`${this.resourceUrl}/fetch-data-values`, {
      params: options,
    });
  }

  deletePeLineValues(req?: any): Observable<CustomResponse<any>> {
    const url ='api/pe_line_values';
    return this.http.post<CustomResponse<any>>(`${url}/delete-pe-line-values`, req);
  }


  printPeFormStatus(object: { pe_form_id: number; section_id: number; fund_source_id: number; admin_hierarchy_id: number; pe_sub_form_id: number; facility_id: any; budget_class_id: number; financial_year_id: number }) {
    const url ='api/pe_line_values';
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    };
    return this.http.get<any>(
      `${url}/print-pe-form-status/${object.financial_year_id}/${object.admin_hierarchy_id}/${object.section_id}/${object.facility_id}/${object.budget_class_id}/${object.fund_source_id}`,httpOptions
    );
  }
}
