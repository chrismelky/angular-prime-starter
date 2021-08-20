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
import { BankAccount } from "./bank-account.model";

@Injectable({ providedIn: "root" })
export class BankAccountService {
  public resourceUrl = "api/bank_accounts";

  constructor(protected http: HttpClient) {}

  create(bankAccount: BankAccount): Observable<CustomResponse<BankAccount>> {
    return this.http.post<CustomResponse<BankAccount>>(
      this.resourceUrl,
      bankAccount
    );
  }

  update(bankAccount: BankAccount): Observable<CustomResponse<BankAccount>> {
    return this.http.put<CustomResponse<BankAccount>>(
      `${this.resourceUrl}/${bankAccount.id}`,
      bankAccount
    );
  }

  find(id: number): Observable<CustomResponse<BankAccount>> {
    return this.http.get<CustomResponse<BankAccount>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<BankAccount[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<BankAccount[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
