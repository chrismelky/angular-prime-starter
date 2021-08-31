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
import { CasPlanContent } from "src/app/setup/cas-plan-content/cas-plan-content.model";
import { CasPlanContentService } from "src/app/setup/cas-plan-content/cas-plan-content.service";
import { CasAssessmentSubCriteriaOption } from "src/app/setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.model";
import { CasAssessmentSubCriteriaOptionService } from "src/app/setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.service";
import { CasAssessmentSubCriteriaReportSet } from "../cas-assessment-sub-criteria-report_set.model";
import { CasAssessmentSubCriteriaReportSetService } from "../cas-assessment-sub-criteria-report_set.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-cas-assessment-sub-criteria-report_set-update",
  templateUrl: "./cas-assessment-sub-criteria-report_set-update.component.html",
})
export class CasAssessmentSubCriteriaReportSetUpdateComponent
  implements OnInit
{
  isSaving = false;
  formError = false;
  errors = [];

  casPlanContents?: CasPlanContent[] = [];
  casAssessmentSubCriteriaOptions?: CasAssessmentSubCriteriaOption[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    cas_plan_content_id: [null, [Validators.required]],
    cas_assessment_sub_criteria_option_id: [null, [Validators.required]],
    report_path: [null, []],
  });

  constructor(
    protected casAssessmentSubCriteriaReportSetService: CasAssessmentSubCriteriaReportSetService,
    protected casPlanContentService: CasPlanContentService,
    protected casAssessmentSubCriteriaOptionService: CasAssessmentSubCriteriaOptionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casPlanContentService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasPlanContent[]>) =>
          (this.casPlanContents = resp.data)
      );
    this.casAssessmentSubCriteriaOptionService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentSubCriteriaOption[]>) =>
          (this.casAssessmentSubCriteriaOptions = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasAssessmentSubCriteriaReportSet or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casAssessmentSubCriteriaReportSet = this.createFromForm();
    if (casAssessmentSubCriteriaReportSet.id !== undefined) {
      this.subscribeToSaveResponse(
        this.casAssessmentSubCriteriaReportSetService.update(
          casAssessmentSubCriteriaReportSet
        )
      );
    } else {
      this.subscribeToSaveResponse(
        this.casAssessmentSubCriteriaReportSetService.create(
          casAssessmentSubCriteriaReportSet
        )
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasAssessmentSubCriteriaReportSet>>
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
   * @param casAssessmentSubCriteriaReportSet
   */
  protected updateForm(
    casAssessmentSubCriteriaReportSet: CasAssessmentSubCriteriaReportSet
  ): void {
    this.editForm.patchValue({
      id: casAssessmentSubCriteriaReportSet.id,
      name: casAssessmentSubCriteriaReportSet.name,
      cas_plan_content_id:
        casAssessmentSubCriteriaReportSet.cas_plan_content_id,
      cas_assessment_sub_criteria_option_id:
        casAssessmentSubCriteriaReportSet.cas_assessment_sub_criteria_option_id,
      report_path: casAssessmentSubCriteriaReportSet.report_path,
    });
  }

  /**
   * Return form values as object of type CasAssessmentSubCriteriaReportSet
   * @returns CasAssessmentSubCriteriaReportSet
   */
  protected createFromForm(): CasAssessmentSubCriteriaReportSet {
    return {
      ...new CasAssessmentSubCriteriaReportSet(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      cas_plan_content_id: this.editForm.get(["cas_plan_content_id"])!.value,
      cas_assessment_sub_criteria_option_id: this.editForm.get([
        "cas_assessment_sub_criteria_option_id",
      ])!.value,
      report_path: this.editForm.get(["report_path"])!.value,
    };
  }
}
