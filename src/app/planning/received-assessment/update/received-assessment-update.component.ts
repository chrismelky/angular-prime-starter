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
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";
import { ReceivedAssessment } from "../received-assessment.model";
import { ReceivedAssessmentService } from "../received-assessment.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-received-assessment-update",
  templateUrl: "./received-assessment-update.component.html",
})
export class ReceivedAssessmentUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  financialYears?: FinancialYear[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    financial_year_id: [null, [Validators.required]],
  });

  constructor(
    protected receivedAssessmentService: ReceivedAssessmentService,
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ReceivedAssessment or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const receivedAssessment = this.createFromForm();
    if (receivedAssessment.id !== undefined) {
      this.subscribeToSaveResponse(
        this.receivedAssessmentService.update(receivedAssessment)
      );
    } else {
      this.subscribeToSaveResponse(
        this.receivedAssessmentService.create(receivedAssessment)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ReceivedAssessment>>
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
   * @param receivedAssessment
   */
  protected updateForm(receivedAssessment: ReceivedAssessment): void {
    this.editForm.patchValue({
      id: receivedAssessment.id,
      financial_year_id: receivedAssessment.financial_year_id,
    });
  }

  /**
   * Return form values as object of type ReceivedAssessment
   * @returns ReceivedAssessment
   */
  protected createFromForm(): ReceivedAssessment {
    return {
      ...new ReceivedAssessment(),
      id: this.editForm.get(["id"])!.value,
      financial_year_id: this.editForm.get(["financial_year_id"])!.value,
    };
  }
}
