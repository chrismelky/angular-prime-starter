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
import { Period } from "src/app/setup/period/period.model";
import { PeriodService } from "src/app/setup/period/period.service";
import { FacilityType } from "src/app/setup/facility-type/facility-type.model";
import { FacilityTypeService } from "src/app/setup/facility-type/facility-type.service";
import { Facility } from "src/app/setup/facility/facility.model";
import { FacilityService } from "src/app/setup/facility/facility.service";
import { ActivityImplementation } from "../activity-implementation.model";
import { ActivityImplementationService } from "../activity-implementation.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-activity-implementation-update",
  templateUrl: "./activity-implementation-update.component.html",
})
export class ActivityImplementationUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  periods?: Period[] = [];
  facilityTypes?: FacilityType[] = [];
  facilities?: Facility[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    admin_hierarchy_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    period_id: [null, [Validators.required]],
    facility_type_id: [null, [Validators.required]],
    facility_id: [null, [Validators.required]],
  });

  constructor(
    protected activityImplementationService: ActivityImplementationService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected periodService: PeriodService,
    protected facilityTypeService: FacilityTypeService,
    protected facilityService: FacilityService,
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
    this.periodService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Period[]>) => (this.periods = resp.data)
      );
    this.facilityTypeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FacilityType[]>) =>
          (this.facilityTypes = resp.data)
      );
    this.facilityService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Facility[]>) => (this.facilities = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ActivityImplementation or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const activityImplementation = this.createFromForm();
    if (activityImplementation.id !== undefined) {
      this.subscribeToSaveResponse(
        this.activityImplementationService.update(activityImplementation)
      );
    } else {
      this.subscribeToSaveResponse(
        this.activityImplementationService.create(activityImplementation)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ActivityImplementation>>
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
   * @param activityImplementation
   */
  protected updateForm(activityImplementation: ActivityImplementation): void {
    this.editForm.patchValue({
      id: activityImplementation.id,
      admin_hierarchy_id: activityImplementation.admin_hierarchy_id,
      financial_year_id: activityImplementation.financial_year_id,
      period_id: activityImplementation.period_id,
      facility_type_id: activityImplementation.facility_type_id,
      facility_id: activityImplementation.facility_id,
    });
  }

  /**
   * Return form values as object of type ActivityImplementation
   * @returns ActivityImplementation
   */
  protected createFromForm(): ActivityImplementation {
    return {
      ...new ActivityImplementation(),
      id: this.editForm.get(["id"])!.value,
      admin_hierarchy_id: this.editForm.get(["admin_hierarchy_id"])!.value,
      financial_year_id: this.editForm.get(["financial_year_id"])!.value,
      period_id: this.editForm.get(["period_id"])!.value,
      facility_type_id: this.editForm.get(["facility_type_id"])!.value,
      facility_id: this.editForm.get(["facility_id"])!.value,
    };
  }
}
