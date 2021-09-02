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
import { FinancialYear } from '../financial-year.model';
import { FinancialYearService } from '../financial-year.service';
import { ToastService } from 'src/app/shared/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-financial-year-update',
  templateUrl: './financial-year-update.component.html',
  providers: [DatePipe],
})
export class FinancialYearUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  previousFinancialYears?: FinancialYear[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    description: [null, []],
    previous_financial_year_id: [null, []],
    // is_active: [null, [Validators.required]],
    // is_current: [null, [Validators.required]],
    status: [null, []],
    sort_order: [null, []],
    start_date: [null, [Validators.required]],
    end_date: [null, [Validators.required]],
  });

  constructor(
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private datePipe: DatePipe,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.financialYearService
      .query()
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.previousFinancialYears = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create FinancialYear Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const financialYear = this.createFromForm();
    if (financialYear.id !== undefined) {
      this.subscribeToSaveResponse(
        this.financialYearService.update(financialYear)
      );
    } else {
      this.subscribeToSaveResponse(
        this.financialYearService.create(financialYear)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FinancialYear>>
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
   * @param financialYear
   */
  protected updateForm(financialYear: FinancialYear): void {
    this.editForm.patchValue({
      id: financialYear.id,
      name: financialYear.name,
      description: financialYear.description,
      previous_financial_year_id: financialYear.previous_financial_year_id,
      // is_active: financialYear.is_active,
      // is_current: financialYear.is_current,
      status: financialYear.status,
      sort_order: financialYear.sort_order,
      start_date: financialYear.start_date
        ? new Date(financialYear.start_date)
        : financialYear.start_date,
      end_date: financialYear.end_date
        ? new Date(financialYear.end_date)
        : financialYear.end_date,
    });
  }

  /**
   * Return form values as object of type FinancialYear
   * @returns FinancialYear
   */
  protected createFromForm(): FinancialYear {
    return {
      ...new FinancialYear(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      previous_financial_year_id: this.editForm.get([
        'previous_financial_year_id',
      ])!.value,
      // is_active: this.editForm.get(['is_active'])!.value,
      // is_current: this.editForm.get(['is_current'])!.value,
      status: this.editForm.get(['status'])!.value,
      sort_order: this.editForm.get(['sort_order'])!.value,
      start_date: this.editForm.get(['start_date'])!.value,
      end_date: this.editForm.get(['end_date'])!.value,
    };
  }
}
