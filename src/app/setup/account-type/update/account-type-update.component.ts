/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {CustomResponse} from '../../../utils/custom-response';
import {AccountType} from '../account-type.model';
import {AccountTypeService} from '../account-type.service';
import {ToastService} from 'src/app/shared/toast.service';
import {EnumService} from "../../../shared/enum.service";

@Component({
  selector: 'app-account-type-update',
  templateUrl: './account-type-update.component.html',
})
export class AccountTypeUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  balanceTypes = this.enumService.get('balanceTypes')

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required, Validators.maxLength(200)]],
    code: [null, [Validators.required, Validators.maxLength(50)]],
    balance_type: ['DEBIT', [Validators.required]],
  });

  constructor(
    protected accountTypeService: AccountTypeService,
    public dialogRef: DynamicDialogRef,
    public enumService: EnumService,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create AccountType or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const accountType = this.createFromForm();
    if (accountType.id !== undefined) {
      this.subscribeToSaveResponse(this.accountTypeService.update(accountType));
    } else {
      this.subscribeToSaveResponse(this.accountTypeService.create(accountType));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<AccountType>>
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
  protected onSaveError(error: any): void {
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param accountType
   */
  protected updateForm(accountType: AccountType): void {
    this.editForm.patchValue({
      id: accountType.id,
      name: accountType.name,
      code: accountType.code,
      balance_type: accountType.balance_type,
    });
  }

  /**
   * Return form values as object of type AccountType
   * @returns AccountType
   */
  protected createFromForm(): AccountType {
    return {
      ...new AccountType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      balance_type: this.editForm.get(['balance_type'])!.value,
    };
  }
}
