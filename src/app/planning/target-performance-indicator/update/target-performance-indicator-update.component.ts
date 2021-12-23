/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { LongTermTarget } from 'src/app/planning/long-term-target/long-term-target.model';
import { LongTermTargetService } from 'src/app/planning/long-term-target/long-term-target.service';
import { PerformanceIndicator } from 'src/app/setup/performance-indicator/performance-indicator.model';
import { PerformanceIndicatorService } from 'src/app/setup/performance-indicator/performance-indicator.service';
import { TargetPerformanceIndicator } from '../target-performance-indicator.model';
import { TargetPerformanceIndicatorService } from '../target-performance-indicator.service';
import { ToastService } from 'src/app/shared/toast.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';

@Component({
  selector: 'app-target-performance-indicator-update',
  templateUrl: './target-performance-indicator-update.component.html',
})
export class TargetPerformanceIndicatorUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];


  longTermTargets?: LongTermTarget[] = [];
  performanceIndicators?: PerformanceIndicator[] = [];
  financialYears: FinancialYear[] = [];
  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    long_term_target_id: [null, []],
    performance_indicator_id: [null, [Validators.required]],
    baseline_value: [null, [Validators.required]],
   // actual_value: [null, [Validators.required]],
    source_of_data: [null, [Validators.required]],
    baseline_date: [null, [Validators.required]],
    y0: [],
    y1: [],
    y2: [],
    y3: [],
    y4: [],
  });

  constructor(
    protected targetPerformanceIndicatorService: TargetPerformanceIndicatorService,
    protected longTermTargetService: LongTermTargetService,
    protected performanceIndicatorService: PerformanceIndicatorService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.performanceIndicatorService
      .query({ columns: ['id', 'description'] })
      .subscribe(
        (resp: CustomResponse<PerformanceIndicator[]>) =>
          (this.performanceIndicators = resp.data)
      );
    const data = this.dialogConfig.data;
    this.longTermTargets = data.longTermTargets;
    this.financialYears = data.financialYears || [];
    this.updateForm(data.targetIndicator); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create TargetPerformanceIndicator or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const targetPerformanceIndicator = this.createFromForm();
    if (targetPerformanceIndicator.id !== undefined) {
      this.subscribeToSaveResponse(
        this.targetPerformanceIndicatorService.update(
          targetPerformanceIndicator
        )
      );
    } else {
      this.subscribeToSaveResponse(
        this.targetPerformanceIndicatorService.create(
          targetPerformanceIndicator
        )
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<TargetPerformanceIndicator>>
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
   * @param targetPerformanceIndicator
   */
  protected updateForm(
    targetPerformanceIndicator: TargetPerformanceIndicator
  ): void {
    this.editForm.patchValue({
      id: targetPerformanceIndicator.id,
      long_term_target_id: targetPerformanceIndicator.long_term_target_id,
      performance_indicator_id:
        targetPerformanceIndicator.performance_indicator_id,
      baseline_value: targetPerformanceIndicator.baseline_value,
      actual_value: targetPerformanceIndicator.actual_value,
      source_of_data: targetPerformanceIndicator.source_of_data,
      baseline_date: targetPerformanceIndicator.baseline_date,
      y0: targetPerformanceIndicator.y0,
      y1: targetPerformanceIndicator.y1,
      y2: targetPerformanceIndicator.y2,
      y3: targetPerformanceIndicator.y3,
      y4: targetPerformanceIndicator.y4,
    });
  }

  get yearValues(): FormArray {
    return this.editForm.get('year_values') as FormArray;
  }

  /**
   * Return form values as object of type TargetPerformanceIndicator
   * @returns TargetPerformanceIndicator
   */
  protected createFromForm(): TargetPerformanceIndicator {
    return {
      ...new TargetPerformanceIndicator(),
      ...this.editForm.value,
    };
  }
}
