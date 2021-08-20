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
import { StartFinancialYear } from "src/app/setup/start-financial-year/start-financial-year.model";
import { StartFinancialYearService } from "src/app/setup/start-financial-year/start-financial-year.service";
import { EndFinancialYear } from "src/app/setup/end-financial-year/end-financial-year.model";
import { EndFinancialYearService } from "src/app/setup/end-financial-year/end-financial-year.service";
import { StrategicPlan } from "../strategic-plan.model";
import { StrategicPlanService } from "../strategic-plan.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-strategic-plan-update",
  templateUrl: "./strategic-plan-update.component.html",
})
export class StrategicPlanUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  adminHierarchies?: AdminHierarchy[] = [];
  startFinancialYears?: StartFinancialYear[] = [];
  endFinancialYears?: EndFinancialYear[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    admin_hierarchy_id: [null, [Validators.required]],
    start_financial_year_id: [null, [Validators.required]],
    end_financial_year_id: [null, [Validators.required]],
    url: [null, []],
  });

  constructor(
    protected strategicPlanService: StrategicPlanService,
    protected adminHierarchyService: AdminHierarchyService,
    protected startFinancialYearService: StartFinancialYearService,
    protected endFinancialYearService: EndFinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminHierarchyService
      .query()
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.startFinancialYearService
      .query()
      .subscribe(
        (resp: CustomResponse<StartFinancialYear[]>) =>
          (this.startFinancialYears = resp.data)
      );
    this.endFinancialYearService
      .query()
      .subscribe(
        (resp: CustomResponse<EndFinancialYear[]>) =>
          (this.endFinancialYears = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create StrategicPlan or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const strategicPlan = this.createFromForm();
    if (strategicPlan.id !== undefined) {
      this.subscribeToSaveResponse(
        this.strategicPlanService.update(strategicPlan)
      );
    } else {
      this.subscribeToSaveResponse(
        this.strategicPlanService.create(strategicPlan)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<StrategicPlan>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and dispaly info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handiling specific to this component
   * Note; general error handleing is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param strategicPlan
   */
  protected updateForm(strategicPlan: StrategicPlan): void {
    this.editForm.patchValue({
      id: strategicPlan.id,
      admin_hierarchy_id: strategicPlan.admin_hierarchy_id,
      start_financial_year_id: strategicPlan.start_financial_year_id,
      end_financial_year_id: strategicPlan.end_financial_year_id,
      url: strategicPlan.url,
    });
  }

  /**
   * Return form values as object of type StrategicPlan
   * @returns StrategicPlan
   */
  protected createFromForm(): StrategicPlan {
    return {
      ...new StrategicPlan(),
      id: this.editForm.get(["id"])!.value,
      admin_hierarchy_id: this.editForm.get(["admin_hierarchy_id"])!.value,
      start_financial_year_id: this.editForm.get(["start_financial_year_id"])!
        .value,
      end_financial_year_id: this.editForm.get(["end_financial_year_id"])!
        .value,
      url: this.editForm.get(["url"])!.value,
    };
  }
}
