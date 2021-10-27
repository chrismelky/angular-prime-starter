/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { EnumService, PlanrepEnum } from 'src/app/shared/enum.service';
import {
  Activity,
  FacilityActivity,
} from 'src/app/planning/activity/activity.model';
import { FundSource } from 'src/app/setup/fund-source/fund-source.model';
import { Facility } from 'src/app/setup/facility/facility.model';
import { Section } from 'src/app/setup/section/section.model';
import { BudgetClass } from 'src/app/setup/budget-class/budget-class.model';
import { ActivityInput } from '../activity-input.model';
import { ActivityInputService } from '../activity-input.service';
import { ToastService } from 'src/app/shared/toast.service';
import { GfsCode } from 'src/app/setup/gfs-code/gfs-code.model';

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
  facilities?: Facility[] = [];
  sections?: Section[] = [];
  budgetClasses?: BudgetClass[] = [];
  units?: PlanrepEnum[] = [];
  gfsCodes?: GfsCode[] = [];
  facilityActivity?: FacilityActivity;
  total = 0.0;
  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    gfs_code_id: [null, [Validators.required]],
    unit_price: [null, [Validators.required]],
    quantity: [null, [Validators.required]],
    frequency: [null, [Validators.required]],
    unit: [null, [Validators.required]],
    forward_year_one_amount: [null, []],
    forward_year_two_amount: [null, []],
    activity_id: [null, [Validators.required]],
    activity_fund_source_id: [null, [Validators.required]],
    budget_class_id: [null, [Validators.required]],
    fund_source_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
    facility_id: [null, [Validators.required]],
    period_one: [null, []],
    period_two: [null, []],
    period_three: [null, []],
    period_four: [null, []],
    has_breakdown: [null, []],
    breakdowns: this.fb.array([]),
  });

  constructor(
    protected activityInputService: ActivityInputService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    const dialogData = this.dialogConfig.data;
    this.facilityActivity = dialogData.facilityActivity;
    this.gfsCodes = dialogData.gfsCodes;
    this.units = this.enumService.get('units');
    const input: ActivityInput = dialogData.activityInput;
    input?.id &&
      this.updateTotal(input.unit_price!, input.quantity!, input.frequency!);
    this.updateForm(input); //Initialize form with data from dialog
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

  updateTotal(
    unit_price?: number,
    quantity?: number,
    frequency?: number
  ): void {
    this.total = (unit_price || 0) * (quantity || 0) * (frequency || 0);
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

  get breakDownControls(): FormArray {
    return this.editForm.controls['breakdowns'] as FormArray;
  }

  addItem(item: any, unit_price: any, quantity: any, frequency: any): void {
    this.addControl({
      item: item.value,
      unit_price: unit_price.value,
      quantity: quantity.value,
      frequency: frequency.value,
    });
    item.value = undefined;
    unit_price.value = undefined;
    quantity.value = undefined;
    frequency.value = undefined;
  }

  addControl(data?: any): void {
    const controlArray = this.breakDownControls;
    controlArray.push(
      this.fb.group({
        item: data?.item,
        quantity: data?.quantity,
        frequency: data?.frequency,
        unit_price: data?.unit_price,
      })
    );
  }

  removeControl(index: number): void {
    this.breakDownControls.removeAt(index);
  }

  /**
   * Set/Initialize form values
   * @param activityInput
   */
  protected updateForm(activityInput: ActivityInput): void {
    this.editForm.patchValue({
      id: activityInput.id,
      gfs_code_id: activityInput.gfs_code_id,
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
      activity_fund_source_id: activityInput.activity_fund_source_id,
      period_one: activityInput.period_one,
      period_two: activityInput.period_two,
      period_three: activityInput.period_three,
      period_four: activityInput.period_four,
      has_breakdown: activityInput.has_breakdown,
    });
    const breakdowns = activityInput.breakdowns
      ? JSON.parse(activityInput.breakdowns)
      : [];
    breakdowns.forEach((b: any) => this.addControl(b));
  }

  /**
   * Return form values as object of type ActivityInput
   * @returns ActivityInput
   */
  protected createFromForm(): ActivityInput {
    const breakdowns = this.editForm.get(['breakdowns'])!.value;
    return {
      ...new ActivityInput(),
      id: this.editForm.get(['id'])!.value,
      gfs_code_id: this.editForm.get(['gfs_code_id'])!.value,
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
      activity_fund_source_id: this.editForm.get(['activity_fund_source_id'])!
        .value,
      period_one: this.editForm.get(['period_one'])!.value,
      period_two: this.editForm.get(['period_two'])!.value,
      period_three: this.editForm.get(['period_three'])!.value,
      period_four: this.editForm.get(['period_four'])!.value,
      has_breakdown: this.editForm.get(['has_breakdown'])!.value,
      breakdowns: breakdowns ? JSON.stringify(breakdowns) : breakdowns,
    };
  }
}
