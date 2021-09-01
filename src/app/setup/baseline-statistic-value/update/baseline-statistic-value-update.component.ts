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
import { BaselineStatistic } from 'src/app/setup/baseline-statistic/baseline-statistic.model';
import { BaselineStatisticService } from 'src/app/setup/baseline-statistic/baseline-statistic.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { BaselineStatisticValue } from '../baseline-statistic-value.model';
import { BaselineStatisticValueService } from '../baseline-statistic-value.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-baseline-statistic-value-update',
  templateUrl: './baseline-statistic-value-update.component.html',
})
export class BaselineStatisticValueUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  baselineStatistics?: BaselineStatistic[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    baseline_statistic_id: [null, [Validators.required]],
    admin_hierarchy_id: [
      { value: null, disabled: true },
      [Validators.required],
    ],
    financial_year_id: [{ value: null, disabled: true }, [Validators.required]],
    value: [null, []],
    active: [false, []],
  });

  constructor(
    protected baselineStatisticValueService: BaselineStatisticValueService,
    protected baselineStatisticService: BaselineStatisticService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.baselineStatisticService
      .query({ columns: ['id', 'description'] })
      .subscribe(
        (resp: CustomResponse<BaselineStatistic[]>) =>
          (this.baselineStatistics = resp.data)
      );
    this.adminHierarchyService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create BaselineStatisticValue or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const baselineStatisticValue = this.createFromForm();
    if (baselineStatisticValue.id !== undefined) {
      this.subscribeToSaveResponse(
        this.baselineStatisticValueService.update(baselineStatisticValue)
      );
    } else {
      this.subscribeToSaveResponse(
        this.baselineStatisticValueService.create(baselineStatisticValue)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<BaselineStatisticValue>>
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
   * @param baselineStatisticValue
   */
  protected updateForm(baselineStatisticValue: BaselineStatisticValue): void {
    this.editForm.patchValue({
      id: baselineStatisticValue.id,
      baseline_statistic_id: baselineStatisticValue.baseline_statistic_id,
      admin_hierarchy_id: baselineStatisticValue.admin_hierarchy_id,
      financial_year_id: baselineStatisticValue.financial_year_id,
      value: baselineStatisticValue.value,
      active: baselineStatisticValue.active,
    });
  }

  /**
   * Return form values as object of type BaselineStatisticValue
   * @returns BaselineStatisticValue
   */
  protected createFromForm(): BaselineStatisticValue {
    return {
      ...new BaselineStatisticValue(),
      id: this.editForm.get(['id'])!.value,
      baseline_statistic_id: this.editForm.get(['baseline_statistic_id'])!
        .value,
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
      financial_year_id: this.editForm.get(['financial_year_id'])!.value,
      value: this.editForm.get(['value'])!.value,
      active: this.editForm.get(['active'])!.value,
    };
  }
}
