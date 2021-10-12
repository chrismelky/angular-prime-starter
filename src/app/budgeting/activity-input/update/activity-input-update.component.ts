/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { EnumService, PlanrepEnum } from 'src/app/shared/enum.service';
import { Activity } from 'src/app/planning/activity/activity.model';
import { ActivityService } from 'src/app/planning/activity/activity.service';
import { FundSource } from 'src/app/setup/fund-source/fund-source.model';
import { FundSourceService } from 'src/app/setup/fund-source/fund-source.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { Facility } from 'src/app/setup/facility/facility.model';
import { FacilityService } from 'src/app/setup/facility/facility.service';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { BudgetClass } from 'src/app/setup/budget-class/budget-class.model';
import { BudgetClassService } from 'src/app/setup/budget-class/budget-class.service';
import { ActivityInput } from '../activity-input.model';
import { ActivityInputService } from '../activity-input.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-activity-input-update',
  templateUrl: './activity-input-update.component.html',
})
export class ActivityInputUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  activities?: Activity[] = [];
  fundSources?: FundSource[] = [];
  financialYears?: FinancialYear[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  facilities?: Facility[] = [];
  sections?: Section[] = [];
  budgetClasses?: BudgetClass[] = [];
  units?: PlanrepEnum[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    unit_price: [null, [Validators.required]],
    quantity: [null, [Validators.required]],
    frequency: [null, [Validators.required]],
    unit: [null, []],
    forward_year_one_amount: [null, []],
    forward_year_two_amount: [null, []],
    activity_id: [null, [Validators.required]],
    fund_source_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    facility_id: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
    budget_class_id: [null, [Validators.required]],
    chart_of_account: [null, []],
    approve_amount: [null, []],
    adjusted_amount: [null, []],
  });

  constructor(
    protected activityInputService: ActivityInputService,
    protected activityService: ActivityService,
    protected fundSourceService: FundSourceService,
    protected financialYearService: FinancialYearService,
    protected adminHierarchyService: AdminHierarchyService,
    protected facilityService: FacilityService,
    protected sectionService: SectionService,
    protected budgetClassService: BudgetClassService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.activityService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Activity[]>) => (this.activities = resp.data)
      );
    this.fundSourceService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data)
      );
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.adminHierarchyService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.facilityService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Facility[]>) => (this.facilities = resp.data)
      );
    this.sectionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    this.budgetClassService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<BudgetClass[]>) =>
          (this.budgetClasses = resp.data)
      );
    this.units = this.enumService.get('units');
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ActivityInput or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const activityInput = this.createFromForm();
    if (activityInput.id !== undefined) {
      this.subscribeToSaveResponse(
        this.activityInputService.update(activityInput)
      );
    } else {
      this.subscribeToSaveResponse(
        this.activityInputService.create(activityInput)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ActivityInput>>
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
   * @param activityInput
   */
  protected updateForm(activityInput: ActivityInput): void {
    this.editForm.patchValue({
      id: activityInput.id,
      unit_price: activityInput.unit_price,
      quantity: activityInput.quantity,
      frequency: activityInput.frequency,
      unit: activityInput.unit,
      forward_year_one_amount: activityInput.forward_year_one_amount,
      forward_year_two_amount: activityInput.forward_year_two_amount,
      activity_id: activityInput.activity_id,
      fund_source_id: activityInput.fund_source_id,
      financial_year_id: activityInput.financial_year_id,
      admin_hierarchy_id: activityInput.admin_hierarchy_id,
      facility_id: activityInput.facility_id,
      section_id: activityInput.section_id,
      budget_class_id: activityInput.budget_class_id,
      chart_of_account: activityInput.chart_of_account,
      approve_amount: activityInput.approve_amount,
      adjusted_amount: activityInput.adjusted_amount,
    });
  }

  /**
   * Return form values as object of type ActivityInput
   * @returns ActivityInput
   */
  protected createFromForm(): ActivityInput {
    return {
      ...new ActivityInput(),
      id: this.editForm.get(['id'])!.value,
      unit_price: this.editForm.get(['unit_price'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      frequency: this.editForm.get(['frequency'])!.value,
      unit: this.editForm.get(['unit'])!.value,
      forward_year_one_amount: this.editForm.get(['forward_year_one_amount'])!
        .value,
      forward_year_two_amount: this.editForm.get(['forward_year_two_amount'])!
        .value,
      activity_id: this.editForm.get(['activity_id'])!.value,
      fund_source_id: this.editForm.get(['fund_source_id'])!.value,
      financial_year_id: this.editForm.get(['financial_year_id'])!.value,
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
      facility_id: this.editForm.get(['facility_id'])!.value,
      section_id: this.editForm.get(['section_id'])!.value,
      budget_class_id: this.editForm.get(['budget_class_id'])!.value,
      chart_of_account: this.editForm.get(['chart_of_account'])!.value,
      approve_amount: this.editForm.get(['approve_amount'])!.value,
      adjusted_amount: this.editForm.get(['adjusted_amount'])!.value,
    };
  }
}
