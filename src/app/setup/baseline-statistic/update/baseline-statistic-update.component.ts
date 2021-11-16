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
import { BaselineStatistic } from '../baseline-statistic.model';
import { BaselineStatisticService } from '../baseline-statistic.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-baseline-statistic-update',
  templateUrl: './baseline-statistic-update.component.html',
})
export class BaselineStatisticUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    code: [null, []],
    default_value: [null, []],
    is_common: [false, []],
    hmis_uid: [null, []],
    active: [false, []],
  });

  constructor(
    protected baselineStatisticService: BaselineStatisticService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create BaselineStatistic or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const baselineStatistic = this.createFromForm();
    if (baselineStatistic.id !== undefined) {
      this.subscribeToSaveResponse(
        this.baselineStatisticService.update(baselineStatistic)
      );
    } else {
      this.subscribeToSaveResponse(
        this.baselineStatisticService.create(baselineStatistic)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<BaselineStatistic>>
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
   * @param baselineStatistic
   */
  protected updateForm(baselineStatistic: BaselineStatistic): void {
    this.editForm.patchValue({
      id: baselineStatistic.id,
      description: baselineStatistic.description,
      code: baselineStatistic.code,
      default_value: baselineStatistic.default_value,
      is_common: baselineStatistic.is_common,
      hmis_uid: baselineStatistic.hmis_uid,
      active: baselineStatistic.active,
    });
  }

  /**
   * Return form values as object of type BaselineStatistic
   * @returns BaselineStatistic
   */
  protected createFromForm(): BaselineStatistic {
    return {
      ...new BaselineStatistic(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      code: this.editForm.get(['code'])!.value,
      default_value: this.editForm.get(['default_value'])!.value,
      is_common: this.editForm.get(['is_common'])!.value,
      hmis_uid: this.editForm.get(['hmis_uid'])!.value,
      active: this.editForm.get(['active'])!.value,
    };
  }
}
