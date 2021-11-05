/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { CustomResponse } from "../../../../utils/custom-response";
import { Facility } from "src/app/setup/facility/facility.model";
import { FacilityService } from "src/app/setup/facility/facility.service";
import { FacilityBankAccount } from "../facility-bank-account.model";
import { FacilityBankAccountService } from "../facility-bank-account.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-facility-bank-account-update",
  templateUrl: "./facility-bank-account-update.component.html",
})
export class FacilityBankAccountUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  facilities?: Facility[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    bank: [null, [Validators.required]],
    branch: [null, [Validators.required]],
    account_name: [null, [Validators.required]],
    account_number: [null, [Validators.required]],
    facility_id: [null, [Validators.required]],
  });

  constructor(
    protected facilityBankAccountService: FacilityBankAccountService,
    protected facilityService: FacilityService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.facilityService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Facility[]>) => (this.facilities = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create FacilityBankAccount or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const facilityBankAccount = this.createFromForm();
    if (facilityBankAccount.id !== undefined) {
      this.subscribeToSaveResponse(
        this.facilityBankAccountService.update(facilityBankAccount)
      );
    } else {
      this.subscribeToSaveResponse(
        this.facilityBankAccountService.create(facilityBankAccount)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FacilityBankAccount>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param facilityBankAccount
   */
  protected updateForm(facilityBankAccount: FacilityBankAccount): void {
    this.editForm.patchValue({
      id: facilityBankAccount.id,
      bank: facilityBankAccount.bank,
      branch: facilityBankAccount.branch,
      account_name: facilityBankAccount.account_name,
      account_number: facilityBankAccount.account_number,
      facility_id: facilityBankAccount.facility_id,
    });
  }

  /**
   * Return form values as object of type FacilityBankAccount
   * @returns FacilityBankAccount
   */
  protected createFromForm(): FacilityBankAccount {
    return {
      ...new FacilityBankAccount(),
      id: this.editForm.get(["id"])!.value,
      bank: this.editForm.get(["bank"])!.value,
      branch: this.editForm.get(["branch"])!.value,
      account_name: this.editForm.get(["account_name"])!.value,
      account_number: this.editForm.get(["account_number"])!.value,
      facility_id: this.editForm.get(["facility_id"])!.value,
    };
  }
}
