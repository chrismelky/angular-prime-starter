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
import { CasAssessmentCategoryVersion } from "src/app/setup/cas-assessment-category-version/cas-assessment-category-version.model";
import { CasAssessmentCategoryVersionService } from "src/app/setup/cas-assessment-category-version/cas-assessment-category-version.service";
import { CasAssessmentState } from "src/app/setup/cas-assessment-state/cas-assessment-state.model";
import { CasAssessmentStateService } from "src/app/setup/cas-assessment-state/cas-assessment-state.service";
import { CasAssessmentCategoryVersionState } from "../cas-assessment-category-version-state.model";
import { CasAssessmentCategoryVersionStateService } from "../cas-assessment-category-version-state.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-cas-assessment-category-version-state-update",
  templateUrl: "./cas-assessment-category-version-state-update.component.html",
})
export class CasAssessmentCategoryVersionStateUpdateComponent
  implements OnInit
{
  isSaving = false;
  formError = false;
  errors = [];

  casAssessmentCategoryVersions?: CasAssessmentCategoryVersion[] = [];
  casAssessmentStates?: CasAssessmentState[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    min_value: [null, []],
    cas_assessment_category_version_id: [null, []],
    cas_assessment_state_id: [null, []],
    max_value: [null, []],
  });

  constructor(
    protected casAssessmentCategoryVersionStateService: CasAssessmentCategoryVersionStateService,
    protected casAssessmentCategoryVersionService: CasAssessmentCategoryVersionService,
    protected casAssessmentStateService: CasAssessmentStateService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casAssessmentCategoryVersionService
      .query({ columns: ["id", "cas_assessment_category_id"] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentCategoryVersion[]>) =>
          (this.casAssessmentCategoryVersions = resp.data)
      );
    this.casAssessmentStateService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentState[]>) =>
          (this.casAssessmentStates = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasAssessmentCategoryVersionState or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casAssessmentCategoryVersionState = this.createFromForm();
    if (casAssessmentCategoryVersionState.id !== undefined) {
      this.subscribeToSaveResponse(
        this.casAssessmentCategoryVersionStateService.update(
          casAssessmentCategoryVersionState
        )
      );
    } else {
      this.subscribeToSaveResponse(
        this.casAssessmentCategoryVersionStateService.create(
          casAssessmentCategoryVersionState
        )
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasAssessmentCategoryVersionState>>
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
   * @param casAssessmentCategoryVersionState
   */
  protected updateForm(
    casAssessmentCategoryVersionState: CasAssessmentCategoryVersionState
  ): void {
    this.editForm.patchValue({
      id: casAssessmentCategoryVersionState.id,
      min_value: casAssessmentCategoryVersionState.min_value,
      cas_assessment_category_version_id:
        casAssessmentCategoryVersionState.cas_assessment_category_version_id,
      cas_assessment_state_id:
        casAssessmentCategoryVersionState.cas_assessment_state_id,
      max_value: casAssessmentCategoryVersionState.max_value,
    });
  }

  /**
   * Return form values as object of type CasAssessmentCategoryVersionState
   * @returns CasAssessmentCategoryVersionState
   */
  protected createFromForm(): CasAssessmentCategoryVersionState {
    return {
      ...new CasAssessmentCategoryVersionState(),
      id: this.editForm.get(["id"])!.value,
      min_value: this.editForm.get(["min_value"])!.value,
      cas_assessment_category_version_id: this.editForm.get([
        "cas_assessment_category_version_id",
      ])!.value,
      cas_assessment_state_id: this.editForm.get(["cas_assessment_state_id"])!
        .value,
      max_value: this.editForm.get(["max_value"])!.value,
    };
  }
}
