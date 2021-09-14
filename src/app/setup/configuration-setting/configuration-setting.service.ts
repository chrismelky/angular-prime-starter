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
import { ConfigurationSetting } from "./configuration-setting.model";

@Injectable({ providedIn: "root" })
export class ConfigurationSettingService {
  public resourceUrl = "api/configuration_settings";

  constructor(protected http: HttpClient) {}

  create(
    configurationSetting: ConfigurationSetting
  ): Observable<CustomResponse<ConfigurationSetting>> {
    return this.http.post<CustomResponse<ConfigurationSetting>>(
      this.resourceUrl,
      configurationSetting
    );
  }

  update(
    configurationSetting: ConfigurationSetting
  ): Observable<CustomResponse<ConfigurationSetting>> {
    return this.http.put<CustomResponse<ConfigurationSetting>>(
      `${this.resourceUrl}/${configurationSetting.id}`,
      configurationSetting
    );
  }

  find(id: number): Observable<CustomResponse<ConfigurationSetting>> {
    return this.http.get<CustomResponse<ConfigurationSetting>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ConfigurationSetting[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ConfigurationSetting[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
