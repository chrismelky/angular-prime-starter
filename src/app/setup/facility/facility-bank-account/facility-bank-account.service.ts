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

import { createRequestOption } from "../../../utils/request-util";
import { CustomResponse } from "../../../utils/custom-response";
import { FacilityBankAccount } from "./facility-bank-account.model";

@Injectable({ providedIn: "root" })
export class FacilityBankAccountService {
  public resourceUrl = "api/facility_bank_accounts";

  constructor(protected http: HttpClient) {}

  create(
    facilityBankAccount: FacilityBankAccount
  ): Observable<CustomResponse<FacilityBankAccount>> {
    return this.http.post<CustomResponse<FacilityBankAccount>>(
      this.resourceUrl,
      facilityBankAccount
    );
  }

  update(
    facilityBankAccount: FacilityBankAccount
  ): Observable<CustomResponse<FacilityBankAccount>> {
    return this.http.put<CustomResponse<FacilityBankAccount>>(
      `${this.resourceUrl}/${facilityBankAccount.id}`,
      facilityBankAccount
    );
  }

  find(id: number): Observable<CustomResponse<FacilityBankAccount>> {
    return this.http.get<CustomResponse<FacilityBankAccount>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FacilityBankAccount[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FacilityBankAccount[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
