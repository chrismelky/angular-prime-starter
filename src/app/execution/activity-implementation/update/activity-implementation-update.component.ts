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
import {ActivityImplementation, ImplementationStatus, ProcurementMethod} from "../activity-implementation.model";
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
  activity?: ActivityImplementation;
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
    code: [null, [Validators.required]],
    description: [null, [Validators.required]],
    budget: [null, [Validators.required]],
    expenditure: [null, [Validators.required]],
    balance: [null, [Validators.required]],
    status_id: [null, [Validators.required]],
    procurement_method_id: [null, [Validators.required]],
    indicator: [null, [Validators.required]],
    indicator_value: [null, [Validators.required]],
    project_output: [null, []],
    project_output_implemented: [null, []],
    actual_implementation: [null, []],
    planned_value: [null, []],
    financial_actual_implementation: [null, []],
    physical_actual_implementation: [null, []],
    remarks: [null, []],
    achievement: [null, []],
  });
   procurementMethods?: ProcurementMethod[] = [];
  implementationStatus?: ImplementationStatus[] = [];

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
  ) {
    this.activity = dialogConfig.data;
  }

  ngOnInit(): void {
    this.implementationStatus  = [
      {name:'Completed'},
      {name:'Not Implemented'},
      {name:'Partially Implemented'},
    ];

    this.procurementMethods = [
      {name:'Contractor'},
      {name:'Force Account'},
      {name:'Single Source'},
    ];

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
      code: activityImplementation.code,
      description: activityImplementation.facility_id,
      budget: activityImplementation.budget,
      expenditure: activityImplementation.expenditure,
      balance: activityImplementation.balance,
      status_id: activityImplementation.status_id,
      procurement_method_id: activityImplementation.procurement_method_id,
      indicator: activityImplementation.indicator,
      indicator_value: activityImplementation.indicator_value,
      project_output: activityImplementation.project_output,
      planned_value: activityImplementation.planned_value,
      project_output_implemented: activityImplementation.project_output_implemented,
      actual_implementation: activityImplementation.actual_implementation,
      financial_actual_implementation: activityImplementation.financial_actual_implementation,
      physical_actual_implementation: activityImplementation.physical_actual_implementation,
      remarks: activityImplementation.remarks,
      achievement: activityImplementation.achievement,
    });
  }

  onSelect(event: any) {
    if (event.files?.length)
      this.editForm.patchValue({
        file: event.files[0],
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
      code: this.editForm.get(["code"])!.value,
      description: this.editForm.get(["description"])!.value,
      budget: this.editForm.get(["budget"])!.value,
      expenditure: this.editForm.get(["expenditure"])!.value,
      balance: this.editForm.get(["balance"])!.value,
      status_id: this.editForm.get(["status_id"])!.value,
      procurement_method_id: this.editForm.get(["procurement_method_id"])!.value,
      indicator: this.editForm.get(["indicator"])!.value,
      indicator_value: this.editForm.get(["indicator_value"])!.value,
      project_output: this.editForm.get(["project_output"])!.value,
      planned_value: this.editForm.get(["planned_value"])!.value,
      project_output_implemented: this.editForm.get(["project_output_implemented"])!.value,
      actual_implementation: this.editForm.get(["actual_implementation"])!.value,
      physical_actual_implementation: this.editForm.get(["physical_actual_implementation"])!.value,
      financial_actual_implementation: this.editForm.get(["financial_actual_implementation"])!.value,
      remarks: this.editForm.get(["remarks"])!.value,
      achievement: this.editForm.get(["achievement"])!.value,
    };
  }
}
