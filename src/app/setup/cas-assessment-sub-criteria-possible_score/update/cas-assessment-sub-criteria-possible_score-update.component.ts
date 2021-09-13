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
import { CasAssessmentSubCriteriaOption } from "src/app/setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.model";
import { CasAssessmentSubCriteriaOptionService } from "src/app/setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.service";
import { CasAssessmentSubCriteriaPossibleScore } from "../cas-assessment-sub-criteria-possible_score.model";
import { CasAssessmentSubCriteriaPossibleScoreService } from "../cas-assessment-sub-criteria-possible_score.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-cas-assessment-sub-criteria-possible_score-update",
  templateUrl:
    "./cas-assessment-sub-criteria-possible_score-update.component.html",
})
export class CasAssessmentSubCriteriaPossibleScoreUpdateComponent
  implements OnInit
{
  isSaving = false;
  formError = false;
  errors = [];

  casAssessmentSubCriteriaOptions?: CasAssessmentSubCriteriaOption[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    value: [null, [Validators.required]],
    description: [null, [Validators.required]],
    cas_assessment_sub_criteria_option_id: [null, [Validators.required]],
  });

  constructor(
    protected casAssessmentSubCriteriaPossibleScoreService: CasAssessmentSubCriteriaPossibleScoreService,
    protected casAssessmentSubCriteriaOptionService: CasAssessmentSubCriteriaOptionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casAssessmentSubCriteriaOptionService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentSubCriteriaOption[]>) =>
          (this.casAssessmentSubCriteriaOptions = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasAssessmentSubCriteriaPossibleScore or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casAssessmentSubCriteriaPossibleScore = this.createFromForm();
    if (casAssessmentSubCriteriaPossibleScore.id !== undefined) {
      this.subscribeToSaveResponse(
        this.casAssessmentSubCriteriaPossibleScoreService.update(
          casAssessmentSubCriteriaPossibleScore
        )
      );
    } else {
      this.subscribeToSaveResponse(
        this.casAssessmentSubCriteriaPossibleScoreService.create(
          casAssessmentSubCriteriaPossibleScore
        )
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasAssessmentSubCriteriaPossibleScore>>
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
   * @param casAssessmentSubCriteriaPossibleScore
   */
  protected updateForm(
    casAssessmentSubCriteriaPossibleScore: CasAssessmentSubCriteriaPossibleScore
  ): void {
    this.editForm.patchValue({
      id: casAssessmentSubCriteriaPossibleScore.id,
      value: casAssessmentSubCriteriaPossibleScore.value,
      description: casAssessmentSubCriteriaPossibleScore.description,
      cas_assessment_sub_criteria_option_id:
        casAssessmentSubCriteriaPossibleScore.cas_assessment_sub_criteria_option_id,
    });
  }

  /**
   * Return form values as object of type CasAssessmentSubCriteriaPossibleScore
   * @returns CasAssessmentSubCriteriaPossibleScore
   */
  protected createFromForm(): CasAssessmentSubCriteriaPossibleScore {
    return {
      ...new CasAssessmentSubCriteriaPossibleScore(),
      id: this.editForm.get(["id"])!.value,
      value: this.editForm.get(["value"])!.value,
      description: this.editForm.get(["description"])!.value,
      cas_assessment_sub_criteria_option_id: this.editForm.get([
        "cas_assessment_sub_criteria_option_id",
      ])!.value,
    };
  }
}
