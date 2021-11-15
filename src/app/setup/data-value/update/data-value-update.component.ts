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
import { DataElement } from 'src/app/setup/data-element/data-element.model';
import { DataElementService } from 'src/app/setup/data-element/data-element.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { Facility } from 'src/app/setup/facility/facility.model';
import { FacilityService } from 'src/app/setup/facility/facility.service';
import { CategoryOptionCombination } from 'src/app/setup/category-option-combination/category-option-combination.model';
import { CategoryOptionCombinationService } from 'src/app/setup/category-option-combination/category-option-combination.service';
import { DataValue } from '../data-value.model';
import { DataValueService } from '../data-value.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-data-value-update',
  templateUrl: './data-value-update.component.html',
})
export class DataValueUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  dataElements?: DataElement[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  facilities?: Facility[] = [];
  categoryOptionCombinations?: CategoryOptionCombination[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    data_element_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    facility_id: [null, [Validators.required]],
    category_option_combination_id: [null, [Validators.required]],
    value: [null, []],
  });

  constructor(
    protected dataValueService: DataValueService,
    protected dataElementService: DataElementService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected facilityService: FacilityService,
    protected categoryOptionCombinationService: CategoryOptionCombinationService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.dataElementService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<DataElement[]>) => (this.dataElements = resp.data)
      );
    this.adminHierarchyService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.categoryOptionCombinationService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CategoryOptionCombination[]>) =>
          (this.categoryOptionCombinations = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create DataValue or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const dataValue = this.createFromForm();
    if (dataValue.id !== undefined) {
      this.subscribeToSaveResponse(this.dataValueService.update(dataValue));
    } else {
      this.subscribeToSaveResponse(this.dataValueService.create(dataValue));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<DataValue>>
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
   * @param dataValue
   */
  protected updateForm(dataValue: DataValue): void {
    this.editForm.patchValue({
      id: dataValue.id,
      data_element_id: dataValue.data_element_id,
      admin_hierarchy_id: dataValue.admin_hierarchy_id,
      financial_year_id: dataValue.financial_year_id,
      facility_id: dataValue.facility_id,
      category_option_combination_id: dataValue.category_option_combination_id,
      value: dataValue.value,
    });
  }

  /**
   * Return form values as object of type DataValue
   * @returns DataValue
   */
  protected createFromForm(): DataValue {
    return {
      ...new DataValue(),
      id: this.editForm.get(['id'])!.value,
      data_element_id: this.editForm.get(['data_element_id'])!.value,
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
      financial_year_id: this.editForm.get(['financial_year_id'])!.value,
      facility_id: this.editForm.get(['facility_id'])!.value,
      category_option_combination_id: this.editForm.get([
        'category_option_combination_id',
      ])!.value,
      value: this.editForm.get(['value'])!.value,
    };
  }
}
