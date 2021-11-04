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
import { OptionSetValue } from "./option-set-value.model";
import {Project} from "../project/project.model";

@Injectable({ providedIn: "root" })
export class OptionSetValueService {
  public resourceUrl = "api/option_set_values";

  constructor(protected http: HttpClient) {}

  create(
    optionSetValue: OptionSetValue
  ): Observable<CustomResponse<OptionSetValue>> {
    return this.http.post<CustomResponse<OptionSetValue>>(
      this.resourceUrl,
      optionSetValue
    );
  }

  update(
    optionSetValue: OptionSetValue
  ): Observable<CustomResponse<OptionSetValue>> {
    return this.http.put<CustomResponse<OptionSetValue>>(
      `${this.resourceUrl}/${optionSetValue.id}`,
      optionSetValue
    );
  }

  find(id: number): Observable<CustomResponse<OptionSetValue>> {
    return this.http.get<CustomResponse<OptionSetValue>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<OptionSetValue[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<OptionSetValue[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  upload(data: any): Observable<CustomResponse<OptionSetValue[]>> {
    return this.http.post<CustomResponse<OptionSetValue[]>>(
      this.resourceUrl + '/upload',
      data
    );
  }

  downloadTemplate(): any {
    return this.http.get(this.resourceUrl + '/downloadUploadTemplate', {
      responseType: 'arraybuffer',
    });
  }
}
