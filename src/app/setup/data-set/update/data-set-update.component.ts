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
import { CasPlanContent } from 'src/app/setup/cas-plan-content/cas-plan-content.model';
import { CasPlanContentService } from 'src/app/setup/cas-plan-content/cas-plan-content.service';
import { DataSet } from '../data-set.model';
import { DataSetService } from '../data-set.service';
import { ToastService } from 'src/app/shared/toast.service';
import { FacilityType } from '../../facility-type/facility-type.model';
import { FacilityTypeService } from '../../facility-type/facility-type.service';
import { Period } from '../../period/period.model';
import { PeriodService } from '../../period/period.service';
import { CasPlanService } from '../../cas-plan/cas-plan.service';
import { CasPlan } from '../../cas-plan/cas-plan.model';

@Component({
  selector: 'app-data-set-update',
  templateUrl: './data-set-update.component.html',
})
export class DataSetUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  casPlanContents?: CasPlanContent[] = [];
  casPlans?: CasPlan[] = [];
  facilityTypes?: FacilityType[] = [];
  periods?: Period[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    cas_plan_content_id: [null, [Validators.required]],
    cas_plan_id: [null, [Validators.required]],
    is_locked: [false, []],
    is_submitted: [false, []],
    facility_types: [null, [Validators.required]],
    periods: [null, [Validators.required]],
    sort_order: [null, []],
  });

  constructor(
    protected dataSetService: DataSetService,
    protected casPlanContentService: CasPlanContentService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected facilityTypeService: FacilityTypeService,
    protected periodService: PeriodService,
    protected casPlanService: CasPlanService
  ) {}

  ngOnInit(): void {
    this.facilityTypeService
      .query()
      .subscribe(
        (resp: CustomResponse<FacilityType[]>) =>
          (this.facilityTypes = resp.data || [])
      );

    this.periodService
      .query({
        columns: ['id', 'name', 'period_group'],
      })
      .subscribe((resp) => (this.periods = resp.data));
    const dialogData = this.dialogConfig.data;
    const dataSet: DataSet = dialogData.dataSet;
    this.casPlans = dialogData.casPlans;
    dataSet.cas_plan_id && this.loadCasPlanContent(dataSet.cas_plan_id!);
    this.updateForm(dataSet); //Initialize form with data from dialog
  }

  /**
   * Load by cas plan id
   */
  loadCasPlanContent(casPlanId: number): void {
    this.casPlanContentService
      .query({ cas_plan_id: casPlanId, columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasPlanContent[]>) =>
          (this.casPlanContents = resp.data)
      );
  }

  /**
   * When form is valid Create DataSet Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const dataSet = this.createFromForm();
    if (dataSet.id !== undefined) {
      this.subscribeToSaveResponse(this.dataSetService.update(dataSet));
    } else {
      this.subscribeToSaveResponse(this.dataSetService.create(dataSet));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<DataSet>>
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
   * @param dataSet
   */
  protected updateForm(dataSet: DataSet): void {
    this.editForm.patchValue({
      id: dataSet.id,
      name: dataSet.name,
      code: dataSet.code,
      cas_plan_content_id: dataSet.cas_plan_content_id,
      cas_plan_id: dataSet.cas_plan_id,
      is_locked: dataSet.is_locked,
      is_submitted: dataSet.is_submitted,
      sort_order: dataSet.sort_order,
      facility_types:
        dataSet.facility_types !== undefined
          ? JSON.parse(dataSet.facility_types!)
          : dataSet.facility_types,
      periods:
        dataSet.periods !== undefined
          ? JSON.parse(dataSet.periods!)
          : dataSet.periods,
    });
  }

  /**
   * Return form values as object of type DataSet
   * @returns DataSet
   */
  protected createFromForm(): DataSet {
    return {
      ...new DataSet(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      cas_plan_content_id: this.editForm.get(['cas_plan_content_id'])!.value,
      cas_plan_id: this.editForm.get(['cas_plan_id'])!.value,
      is_locked: this.editForm.get(['is_locked'])!.value,
      is_submitted: this.editForm.get(['is_submitted'])!.value,
      sort_order: this.editForm.get(['sort_order'])!.value,
      facility_types:
        this.editForm.get(['facility_types'])!.value !== undefined
          ? JSON.stringify(this.editForm.get(['facility_types'])!.value)
          : undefined,
      periods:
        this.editForm.get(['periods'])!.value !== undefined
          ? JSON.stringify(this.editForm.get(['periods'])!.value)
          : undefined,
    };
  }
}
