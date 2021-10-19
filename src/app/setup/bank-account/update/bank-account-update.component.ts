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

import { CustomResponse } from "../../../utils/custom-response";
import { BankAccount } from "../bank-account.model";
import { BankAccountService } from "../bank-account.service";
import { ToastService } from "src/app/shared/toast.service";
import {GfsCodeService} from "../../gfs-code/gfs-code.service";
import {AdminHierarchyLevel} from "../../admin-hierarchy-level/admin-hierarchy-level.model";
import {GfsCode} from "../../gfs-code/gfs-code.model";

@Component({
  selector: "app-bank-account-update",
  templateUrl: "./bank-account-update.component.html",
})
export class BankAccountUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  gfsCodes?: GfsCode[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    gfs_code_id: [null, [Validators.required]],
  });

  constructor(
    protected bankAccountService: BankAccountService,
    protected gfsCodeService: GfsCodeService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.gfsCodeService
      .gfsCodesByAccountTypeName('Cash')
      .subscribe(
        (resp: CustomResponse<GfsCode[]>) =>
          (this.gfsCodes = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create BankAccount or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const bankAccount = this.createFromForm();
    if (bankAccount.id !== undefined) {
      this.subscribeToSaveResponse(this.bankAccountService.update(bankAccount));
    } else {
      this.subscribeToSaveResponse(this.bankAccountService.create(bankAccount));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<BankAccount>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and dispaly info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handiling specific to this component
   * Note; general error handleing is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param bankAccount
   */
  protected updateForm(bankAccount: BankAccount): void {
    this.editForm.patchValue({
      id: bankAccount.id,
      name: bankAccount.name,
      code: bankAccount.code,
      gfs_code_id: bankAccount.gfs_code_id,
    });
  }

  /**
   * Return form values as object of type BankAccount
   * @returns BankAccount
   */
  protected createFromForm(): BankAccount {
    return {
      ...new BankAccount(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      gfs_code_id: this.editForm.get(["gfs_code_id"])!.value,
    };
  }
}
