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
import { User } from "src/app/setup/user/user.model";
import { UserService } from "src/app/setup/user/user.service";
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { AdminHierarchyLevel } from "src/app/setup/admin-hierarchy-level/admin-hierarchy-level.model";
import { AdminHierarchyLevelService } from "src/app/setup/admin-hierarchy-level/admin-hierarchy-level.service";
import { CasAssessmentRound } from "src/app/setup/cas-assessment-round/cas-assessment-round.model";
import { CasAssessmentRoundService } from "src/app/setup/cas-assessment-round/cas-assessment-round.service";
import { Period } from "src/app/setup/period/period.model";
import { PeriodService } from "src/app/setup/period/period.service";
import { CasAssessmentCategoryVersion } from "src/app/setup/cas-assessment-category-version/cas-assessment-category-version.model";
import { CasAssessmentCategoryVersionService } from "src/app/setup/cas-assessment-category-version/cas-assessment-category-version.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";
import { AssessorAssignment } from "../assessor-assignment.model";
import { AssessorAssignmentService } from "../assessor-assignment.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-assessor-assignment-update",
  templateUrl: "./assessor-assignment-update.component.html",
})
export class AssessorAssignmentUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  users?: User[] = [];
  admin_hierarchies?: AdminHierarchy[] = [];
  adminHierarchyLevels?: AdminHierarchyLevel[] = [];
  casAssessmentRounds?: CasAssessmentRound[] = [];
  periods?: Period[] = [];
  casAssessmentCategoryVersions?: CasAssessmentCategoryVersion[] = [];
  financialYears?: FinancialYear[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    user_id: [null, []],
    admin_hierarchies: [null, []],
    cas_assessment_round_id: [null, [Validators.required]],
    period_id: [null, [Validators.required]],
    cas_assessment_category_version_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    active: [false, []],
  });

  constructor(
    protected assessorAssignmentService: AssessorAssignmentService,
    protected userService: UserService,
    protected adminHierarchyService: AdminHierarchyService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService,
    protected casAssessmentRoundService: CasAssessmentRoundService,
    protected periodService: PeriodService,
    protected casAssessmentCategoryVersionService: CasAssessmentCategoryVersionService,
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.userService
      .query({ columns: ["id", "first_name", "last_name", "mobile_number","username","email"] })
      .subscribe((resp: CustomResponse<User[]>) => (this.users = resp.data));
    this.adminHierarchyService
      .query({ admin_hierarchy_position: 2 })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.admin_hierarchies = resp.data)
      );
    this.casAssessmentRoundService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentRound[]>) =>
          (this.casAssessmentRounds = resp.data)
      );
    this.periodService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Period[]>) => (this.periods = resp.data)
      );
    this.casAssessmentCategoryVersionService
      .query({ columns: ["id", "cas_category_name"] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentCategoryVersion[]>) =>
          (this.casAssessmentCategoryVersions = resp.data)
      );
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create AssessorAssignment or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const assessorAssignment = this.createFromForm();
    if (assessorAssignment.id !== undefined) {
      this.subscribeToSaveResponse(
        this.assessorAssignmentService.update(assessorAssignment)
      );
    } else {
      this.subscribeToSaveResponse(
        this.assessorAssignmentService.create(assessorAssignment)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<AssessorAssignment>>
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
   * @param assessorAssignment
   */
  protected updateForm(assessorAssignment: AssessorAssignment): void {
    const adminIds =  assessorAssignment.admin_hierarchies?.map((admin_hierarchy: { id: any; })=>admin_hierarchy.id);
    this.editForm.patchValue({
      id: assessorAssignment.id,
      user_id: assessorAssignment.user_id,
      admin_hierarchies: adminIds,
      cas_assessment_round_id: assessorAssignment.cas_assessment_round_id,
      period_id: assessorAssignment.period_id,
      cas_assessment_category_version_id:
        assessorAssignment.cas_assessment_category_version_id,
      financial_year_id: assessorAssignment.financial_year_id,
    });
  }

  /**
   * Return form values as object of type AssessorAssignment
   * @returns AssessorAssignment
   */
  protected createFromForm(): AssessorAssignment {
    return {
      ...new AssessorAssignment(),
      id: this.editForm.get(["id"])!.value,
      user_id: this.editForm.get(["user_id"])!.value,
      admin_hierarchies: this.editForm.get(["admin_hierarchies"])!.value,
      cas_assessment_round_id: this.editForm.get(["cas_assessment_round_id"])!
        .value,
      period_id: this.editForm.get(["period_id"])!.value,
      cas_assessment_category_version_id: this.editForm.get([
        "cas_assessment_category_version_id",
      ])!.value,
      financial_year_id: this.editForm.get(["financial_year_id"])!.value,
    };
  }
}
