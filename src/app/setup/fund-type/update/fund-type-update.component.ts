/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { FundType } from '../fund-type.model';
import { FundTypeService } from '../fund-type.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-fund-type-update',
  templateUrl: './fund-type-update.component.html',
})
export class FundTypeUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    current_budget_code: [null, [Validators.required]],
    carry_over_budget_code: [null, [Validators.required]],
    is_active: [false, []],
  });

  constructor(
    protected fundTypeService: FundTypeService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create FundType or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const fundType = this.createFromForm();
    if (fundType.id !== undefined) {
      this.subscribeToSaveResponse(this.fundTypeService.update(fundType));
    } else {
      this.subscribeToSaveResponse(this.fundTypeService.create(fundType));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FundType>>
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
   * @param fundType
   */
  protected updateForm(fundType: FundType): void {
    this.editForm.patchValue({
      id: fundType.id,
      name: fundType.name,
      current_budget_code: fundType.current_budget_code,
      carry_over_budget_code: fundType.carry_over_budget_code,
      is_active: fundType.is_active,
    });
  }

  /**
   * Return form values as object of type FundType
   * @returns FundType
   */
  protected createFromForm(): FundType {
    return {
      ...new FundType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      current_budget_code: this.editForm.get(['current_budget_code'])!.value,
      carry_over_budget_code: this.editForm.get(['carry_over_budget_code'])!
        .value,
      is_active: this.editForm.get(['is_active'])!.value,
    };
  }
}
