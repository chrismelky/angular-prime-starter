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
import { AssessmentHome } from "../assessment-home.model";
import { AssessmentHomeService } from "../assessment-home.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-assessment-home-update",
  templateUrl: "./assessment-home-update.component.html",
})
export class AssessmentHomeUpdateComponent implements OnInit {
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
    protected assessmentHomeService: AssessmentHomeService,
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
   * When form is valid Create AssessmentHome or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const assessmentHome = this.createFromForm();
    if (assessmentHome.id !== undefined) {
      this.subscribeToSaveResponse(
        this.assessmentHomeService.update(assessmentHome)
      );
    } else {
      this.subscribeToSaveResponse(
        this.assessmentHomeService.create(assessmentHome)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<AssessmentHome>>
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
   * @param assessmentHome
   */
  protected updateForm(assessmentHome: AssessmentHome): void {
    this.editForm.patchValue({
      id: assessmentHome.id,
      financial_year_id: assessmentHome.financial_year_id,
    });
  }

  /**
   * Return form values as object of type AssessmentHome
   * @returns AssessmentHome
   */
  protected createFromForm(): AssessmentHome {
    return {
      ...new AssessmentHome(),
      id: this.editForm.get(["id"])!.value,
      financial_year_id: this.editForm.get(["financial_year_id"])!.value,
    };
  }
}
