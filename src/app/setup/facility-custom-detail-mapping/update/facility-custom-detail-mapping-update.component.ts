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
import { FacilityCustomDetail } from 'src/app/setup/facility-custom-detail/facility-custom-detail.model';
import { FacilityCustomDetailService } from 'src/app/setup/facility-custom-detail/facility-custom-detail.service';
import { FacilityType } from 'src/app/setup/facility-type/facility-type.model';
import { FacilityTypeService } from 'src/app/setup/facility-type/facility-type.service';
import { FacilityCustomDetailMapping } from '../facility-custom-detail-mapping.model';
import { FacilityCustomDetailMappingService } from '../facility-custom-detail-mapping.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-facility-custom-detail-mapping-update',
  templateUrl: './facility-custom-detail-mapping-update.component.html',
})
export class FacilityCustomDetailMappingUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  facilityCustomDetails?: FacilityCustomDetail[] = [];
  facilityTypes?: FacilityType[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    facility_custom_detail_id: [null, [Validators.required]],
    facility_type_id: [null, [Validators.required]],
  });

  constructor(
    protected facilityCustomDetailMappingService: FacilityCustomDetailMappingService,
    protected facilityCustomDetailService: FacilityCustomDetailService,
    protected facilityTypeService: FacilityTypeService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.facilityCustomDetailService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FacilityCustomDetail[]>) =>
          (this.facilityCustomDetails = resp.data)
      );
    this.facilityTypeService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FacilityType[]>) =>
          (this.facilityTypes = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create FacilityCustomDetailMapping or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const facilityCustomDetailMapping = this.createFromForm();
    if (facilityCustomDetailMapping.id !== undefined) {
      this.subscribeToSaveResponse(
        this.facilityCustomDetailMappingService.update(
          facilityCustomDetailMapping
        )
      );
    } else {
      this.subscribeToSaveResponse(
        this.facilityCustomDetailMappingService.create(
          facilityCustomDetailMapping
        )
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FacilityCustomDetailMapping>>
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
   * @param facilityCustomDetailMapping
   */
  protected updateForm(
    facilityCustomDetailMapping: FacilityCustomDetailMapping
  ): void {
    this.editForm.patchValue({
      id: facilityCustomDetailMapping.id,
      facility_custom_detail_id:
        facilityCustomDetailMapping.facility_custom_detail_id,
      facility_type_id: facilityCustomDetailMapping.facility_type_id,
    });
  }

  /**
   * Return form values as object of type FacilityCustomDetailMapping
   * @returns FacilityCustomDetailMapping
   */
  protected createFromForm(): FacilityCustomDetailMapping {
    return {
      ...new FacilityCustomDetailMapping(),
      id: this.editForm.get(['id'])!.value,
      facility_custom_detail_id: this.editForm.get([
        'facility_custom_detail_id',
      ])!.value,
      facility_type_id: this.editForm.get(['facility_type_id'])!.value,
    };
  }
}
