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
  breakDownFormError = false;
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
  totalYrOne = 0.0;
  totalYrTwo = 0.0;
  periodSum = 0.0;
  totalToAdd = 0.0;
  totalToBreakDown = 0.0;
  /**
   * Declare form
   */
  breakDownForm = this.fb.group({
    item: [null, [Validators.required]],
    unit_price: [null, [Validators.required]],
    quantity: [null, [Validators.required]],
    frequency: [null, [Validators.required]],
    unit: [null, [Validators.required]],
  });

  editForm = this.fb.group({
    id: [null, []],
    gfs_code_id: [null, [Validators.required]],
    unit_price: [null, [Validators.required]],
    quantity: [null, [Validators.required]],
    frequency: [null, [Validators.required]],
    unit: [null, [Validators.required]],
    quantity_yr_one: [null, [Validators.required]],
    quantity_yr_two: [null, [Validators.required]],
    frequency_yr_one: [null, [Validators.required]],
    frequency_yr_two: [null, [Validators.required]],
    activity_id: [null, [Validators.required]],
    activity_fund_source_id: [null, [Validators.required]],
    budget_class_id: [null, [Validators.required]],
    fund_source_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
    facility_id: [null, [Validators.required]],
    period: [null, [Validators.required]], //validator field to sum up into 100
    period_one: [null, [Validators.max(100)]],
    period_two: [null, [Validators.max(100)]],
    period_three: [null, [Validators.max(100)]],
    period_four: [null, [Validators.max(100)]],
    has_breakdown: [null, []],
    is_inkind: [null, []],
    breakdowns: this.fb.array([]),
    breakdownValid: [null, []],
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
    if (input.id) {
      this.updateTotal(input.unit_price!, input.quantity!, input.frequency!);
      this.updateTotalYrOne(
        input.unit_price!,
        input.quantity_yr_one!,
        input.frequency_yr_one!
      );
      this.updateTotalYrTwo(
        input.unit_price!,
        input.quantity_yr_one!,
        input.frequency_yr_one!
      );
      this.onPeriodChange(
        input.period_one,
        input.period_two,
        input.period_three,
        input.period_four
      );
      this.onHasBreakDownChange(input.has_breakdown);
    }
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

  updateTotalYrOne(
    unit_price?: number,
    quantity?: number,
    frequency?: number
  ): void {
    this.totalYrOne = (unit_price || 0) * (quantity || 0) * (frequency || 0);
  }

  updateTotalYrTwo(
    unit_price?: number,
    quantity?: number,
    frequency?: number
  ): void {
    this.totalYrTwo = (unit_price || 0) * (quantity || 0) * (frequency || 0);
  }

  onPeriodChange(q1?: number, q2?: number, q3?: number, q4?: number): void {
    this.periodSum = (q1 || 0) + (q2 || 0) + (q3 || 0) + (q4 || 0);
    if (this.periodSum !== 100) {
      this.editForm.get('period')?.setValidators([Validators.required]);
    } else {
      this.editForm.get('period')?.clearValidators();
    }
    this.editForm.get('period')?.updateValueAndValidity();
  }

  onHasBreakDownChange(hasBreakdown: any): void {
    if (hasBreakdown) {
      this.updateBreakdownTotal();
      if (this.total !== this.totalToBreakDown) {
        this.editForm
          .get('breakdownValid')
          ?.setValidators([Validators.required]);
      }
    } else {
      this.editForm.get('breakdowns')?.reset();
      this.editForm.get('breakdownValid')?.clearValidators();
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

  get breakDownControls(): FormArray {
    return this.editForm.controls['breakdowns'] as FormArray;
  }

  addItem(): void {
    this.addControl(this.breakDownForm.value);
    this.breakDownForm.reset();
  }

  addControl(data?: any): void {
    const controlArray = this.breakDownControls;
    controlArray.push(
      this.fb.group({
        item: data?.item,
        unit: data?.unit,
        quantity: data?.quantity,
        frequency: data?.frequency,
        unit_price: data?.unit_price,
      })
    );
    this.updateBreakdownTotal();
  }

  private updateBreakDownValidity(): void {
    if (this.total !== this.totalToBreakDown) {
      this.editForm.get('breakdownValid')?.setValidators([Validators.required]);
    } else {
      this.editForm.get('breakdownValid')?.clearValidators();
    }
    this.editForm.get('breakdownValid')?.updateValueAndValidity();
  }

  removeControl(index: number): void {
    this.breakDownControls.removeAt(index);
    this.updateBreakdownTotal();
  }

  private updateBreakdownTotal(): void {
    this.totalToBreakDown = 0.0;
    this.editForm.get('breakdowns')?.value.forEach((b: any) => {
      this.totalToBreakDown += b.unit_price * b.quantity * b.frequency;
    });
    this.updateBreakDownValidity();
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
      frequency_yr_one: activityInput.frequency_yr_one,
      frequency_yr_two: activityInput.frequency_yr_two,
      unit: activityInput.unit,
      quantity_yr_one: activityInput.quantity_yr_one,
      quantity_yr_two: activityInput.quantity_yr_two,
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
      is_inkind: activityInput.is_inkind,
    });
    const breakdowns = activityInput.breakdowns
      ? JSON.parse(activityInput.breakdowns)
      : [];
    breakdowns.forEach((b: any) => this.addControl(b));
    if (!this.facilityActivity?.period_one) {
      this.editForm.get('period_one')?.disable();
      this.editForm.patchValue({
        period_one: 0,
      });
    } else {
      this.editForm.get('period_one')?.setValidators([Validators.required]);
    }

    if (!this.facilityActivity?.period_two) {
      this.editForm.get('period_two')?.disable();
      this.editForm.patchValue({
        period_two: 0,
      });
    } else {
      this.editForm.get('period_two')?.setValidators([Validators.required]);
    }

    if (!this.facilityActivity?.period_three) {
      this.editForm.get('period_three')?.disable();
      this.editForm.patchValue({
        period_three: 0,
      });
    } else {
      this.editForm.get('period_three')?.setValidators([Validators.required]);
    }

    if (!this.facilityActivity?.period_four) {
      this.editForm.get('period_four')?.disable();
      this.editForm.patchValue({
        period_four: 0,
      });
    } else {
      this.editForm.get('period_four')?.setValidators([Validators.required]);
    }
  }

  /**
   * Return form values as object of type ActivityInput
   * @returns ActivityInput
   */
  protected createFromForm(): ActivityInput {
    const breakdowns = this.editForm.get(['breakdowns'])!.value;
    return {
      ...new ActivityInput(),
      ...this.editForm.value,
      breakdowns: breakdowns ? JSON.stringify(breakdowns) : breakdowns,
    };
  }
}
