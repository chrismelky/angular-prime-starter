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
import { FacilityCustomDetail } from "src/app/setup/facility-custom-detail/facility-custom-detail.model";
import { FacilityCustomDetailService } from "src/app/setup/facility-custom-detail/facility-custom-detail.service";
import { FacilityCustomDetailValue } from "../facility-custom-detail-value.model";
import { FacilityCustomDetailValueService } from "../facility-custom-detail-value.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-facility-custom-detail-value-update",
  templateUrl: "./facility-custom-detail-value-update.component.html",
})
export class FacilityCustomDetailValueUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  facilityCustomDetails?: FacilityCustomDetail[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    facility_custom_detail_id: [null, [Validators.required]],
    value: [null, [Validators.required]],
  });

  constructor(
    protected facilityCustomDetailValueService: FacilityCustomDetailValueService,
    protected facilityCustomDetailService: FacilityCustomDetailService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.facilityCustomDetailService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FacilityCustomDetail[]>) =>
          (this.facilityCustomDetails = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create FacilityCustomDetailValue or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const facilityCustomDetailValue = this.createFromForm();
    if (facilityCustomDetailValue.id !== undefined) {
      this.subscribeToSaveResponse(
        this.facilityCustomDetailValueService.update(facilityCustomDetailValue)
      );
    } else {
      this.subscribeToSaveResponse(
        this.facilityCustomDetailValueService.create(facilityCustomDetailValue)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FacilityCustomDetailValue>>
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
   * @param facilityCustomDetailValue
   */
  protected updateForm(
    facilityCustomDetailValue: FacilityCustomDetailValue
  ): void {
    this.editForm.patchValue({
      id: facilityCustomDetailValue.id,
      facility_custom_detail_id:
        facilityCustomDetailValue.facility_custom_detail_id,
      value: facilityCustomDetailValue.value,
    });
  }

  /**
   * Return form values as object of type FacilityCustomDetailValue
   * @returns FacilityCustomDetailValue
   */
  protected createFromForm(): FacilityCustomDetailValue {
    return {
      ...new FacilityCustomDetailValue(),
      id: this.editForm.get(["id"])!.value,
      facility_custom_detail_id: this.editForm.get([
        "facility_custom_detail_id",
      ])!.value,
      value: this.editForm.get(["value"])!.value,
    };
  }
}
