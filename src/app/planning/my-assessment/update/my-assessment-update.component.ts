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
import { MyAssessment } from "../my-assessment.model";
import { MyAssessmentService } from "../my-assessment.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-my-assessment-update",
  templateUrl: "./my-assessment-update.component.html",
})
export class MyAssessmentUpdateComponent implements OnInit {
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
    protected myAssessmentService: MyAssessmentService,
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
   * When form is valid Create MyAssessment or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const myAssessment = this.createFromForm();
    if (myAssessment.id !== undefined) {
      this.subscribeToSaveResponse(
        this.myAssessmentService.update(myAssessment)
      );
    } else {
      this.subscribeToSaveResponse(
        this.myAssessmentService.create(myAssessment)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<MyAssessment>>
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
   * @param myAssessment
   */
  protected updateForm(myAssessment: MyAssessment): void {
    this.editForm.patchValue({
      id: myAssessment.id,
      financial_year_id: myAssessment.financial_year_id,
    });
  }

  /**
   * Return form values as object of type MyAssessment
   * @returns MyAssessment
   */
  protected createFromForm(): MyAssessment {
    return {
      ...new MyAssessment(),
      id: this.editForm.get(["id"])!.value,
      financial_year_id: this.editForm.get(["financial_year_id"])!.value,
    };
  }
}
