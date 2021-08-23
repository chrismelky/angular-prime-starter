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
import { CasPlan } from "src/app/setup/cas-plan/cas-plan.model";
import { CasPlanService } from "src/app/setup/cas-plan/cas-plan.service";
import { PeriodGroup } from "src/app/setup/period-group/period-group.model";
import { PeriodGroupService } from "src/app/setup/period-group/period-group.service";
import { AdminHierarchyLevel } from "src/app/setup/admin-hierarchy-level/admin-hierarchy-level.model";
import { AdminHierarchyLevelService } from "src/app/setup/admin-hierarchy-level/admin-hierarchy-level.service";
import { CasAssessmentCategory } from "../cas-assessment-category.model";
import { CasAssessmentCategoryService } from "../cas-assessment-category.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-cas-assessment-category-update",
  templateUrl: "./cas-assessment-category-update.component.html",
})
export class CasAssessmentCategoryUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  casPlans?: CasPlan[] = [];
  periodGroups?: PeriodGroup[] = [];
  adminHierarchyLevels?: AdminHierarchyLevel[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    cas_plan_id: [null, [Validators.required]],
    period_group_id: [null, [Validators.required]],
    admin_hierarchy_level_id: [null, [Validators.required]],
  });

  constructor(
    protected casAssessmentCategoryService: CasAssessmentCategoryService,
    protected casPlanService: CasPlanService,
    protected periodGroupService: PeriodGroupService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casPlanService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasPlan[]>) => (this.casPlans = resp.data)
      );
    this.periodGroupService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<PeriodGroup[]>) => (this.periodGroups = resp.data)
      );
    this.adminHierarchyLevelService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>
          (this.adminHierarchyLevels = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasAssessmentCategory or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casAssessmentCategory = this.createFromForm();
    if (casAssessmentCategory.id !== undefined) {
      this.subscribeToSaveResponse(
        this.casAssessmentCategoryService.update(casAssessmentCategory)
      );
    } else {
      this.subscribeToSaveResponse(
        this.casAssessmentCategoryService.create(casAssessmentCategory)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasAssessmentCategory>>
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
   * @param casAssessmentCategory
   */
  protected updateForm(casAssessmentCategory: CasAssessmentCategory): void {
    this.editForm.patchValue({
      id: casAssessmentCategory.id,
      name: casAssessmentCategory.name,
      cas_plan_id: casAssessmentCategory.cas_plan_id,
      period_group_id: casAssessmentCategory.period_group_id,
      admin_hierarchy_level_id: casAssessmentCategory.admin_hierarchy_level_id,
    });
  }

  /**
   * Return form values as object of type CasAssessmentCategory
   * @returns CasAssessmentCategory
   */
  protected createFromForm(): CasAssessmentCategory {
    return {
      ...new CasAssessmentCategory(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      cas_plan_id: this.editForm.get(["cas_plan_id"])!.value,
      period_group_id: this.editForm.get(["period_group_id"])!.value,
      admin_hierarchy_level_id: this.editForm.get(["admin_hierarchy_level_id"])!
        .value,
    };
  }
}
