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
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";
import { CasAssessmentRound } from "src/app/setup/cas-assessment-round/cas-assessment-round.model";
import { CasAssessmentRoundService } from "src/app/setup/cas-assessment-round/cas-assessment-round.service";
import { AssessmentCriteria } from "../assessment-criteria.model";
import { AssessmentCriteriaService } from "../assessment-criteria.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-assessment-criteria-update",
  templateUrl: "./assessment-criteria-update.component.html",
})
export class AssessmentCriteriaUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  casAssessmentRounds?: CasAssessmentRound[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    admin_hierarchy_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    cas_assessment_round_id: [null, [Validators.required]],
  });

  constructor(
    protected assessmentCriteriaService: AssessmentCriteriaService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected casAssessmentRoundService: CasAssessmentRoundService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminHierarchyService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.casAssessmentRoundService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentRound[]>) =>
          (this.casAssessmentRounds = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create AssessmentCriteria or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const assessmentCriteria = this.createFromForm();
    if (assessmentCriteria.id !== undefined) {
      this.subscribeToSaveResponse(
        this.assessmentCriteriaService.update(assessmentCriteria)
      );
    } else {
      this.subscribeToSaveResponse(
        this.assessmentCriteriaService.create(assessmentCriteria)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<AssessmentCriteria>>
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
   * @param assessmentCriteria
   */
  protected updateForm(assessmentCriteria: AssessmentCriteria): void {
    this.editForm.patchValue({
      id: assessmentCriteria.id,
      admin_hierarchy_id: assessmentCriteria.admin_hierarchy_id,
      financial_year_id: assessmentCriteria.financial_year_id,
      cas_assessment_round_id: assessmentCriteria.cas_assessment_round_id,
    });
  }

  /**
   * Return form values as object of type AssessmentCriteria
   * @returns AssessmentCriteria
   */
  protected createFromForm(): AssessmentCriteria {
    return {
      ...new AssessmentCriteria(),
      id: this.editForm.get(["id"])!.value,
      admin_hierarchy_id: this.editForm.get(["admin_hierarchy_id"])!.value,
      financial_year_id: this.editForm.get(["financial_year_id"])!.value,
      cas_assessment_round_id: this.editForm.get(["cas_assessment_round_id"])!
        .value,
    };
  }
}
