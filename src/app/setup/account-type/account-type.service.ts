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
import { AccountType } from "./account-type.model";

@Injectable({ providedIn: "root" })
export class AccountTypeService {
  public resourceUrl = "api/account_types";

  constructor(protected http: HttpClient) {}

  create(accountType: AccountType): Observable<CustomResponse<AccountType>> {
    return this.http.post<CustomResponse<AccountType>>(
      this.resourceUrl,
      accountType
    );
  }

  update(accountType: AccountType): Observable<CustomResponse<AccountType>> {
    return this.http.put<CustomResponse<AccountType>>(
      `${this.resourceUrl}/${accountType.id}`,
      accountType
    );
  }

  find(id: number): Observable<CustomResponse<AccountType>> {
    return this.http.get<CustomResponse<AccountType>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<AccountType[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<AccountType[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
