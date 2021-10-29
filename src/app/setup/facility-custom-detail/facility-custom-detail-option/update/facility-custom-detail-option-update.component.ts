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

import { CustomResponse } from "../../../../utils/custom-response";
import { FacilityCustomDetail } from "src/app/setup/facility-custom-detail/facility-custom-detail.model";
import { FacilityCustomDetailService } from "src/app/setup/facility-custom-detail/facility-custom-detail.service";
import { FacilityCustomDetailOption } from "../facility-custom-detail-option.model";
import { FacilityCustomDetailOptionService } from "../facility-custom-detail-option.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-facility-custom-detail-option-update",
  templateUrl: "./facility-custom-detail-option-update.component.html",
})
export class FacilityCustomDetailOptionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  facilityCustomDetail!: FacilityCustomDetail;

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    value: [null, [Validators.required]],
    label: [null, [Validators.required]],
  });

  constructor(
    protected facilityCustomDetailOptionService: FacilityCustomDetailOptionService,
    protected facilityCustomDetailService: FacilityCustomDetailService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.facilityCustomDetail = this.dialogConfig.data.facilityCustomDetail;
  }

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data.facilityCustomDetailOption); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create FacilityCustomDetailOption or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const facilityCustomDetailOption = this.createFromForm();
    facilityCustomDetailOption.facility_custom_detail_id = this.facilityCustomDetail.id;
    if (facilityCustomDetailOption.id === undefined || facilityCustomDetailOption.id === null || !facilityCustomDetailOption.id) {
      this.subscribeToSaveResponse(
        this.facilityCustomDetailOptionService.create(
          facilityCustomDetailOption
        )
      );
    } else {
      this.subscribeToSaveResponse(
        this.facilityCustomDetailOptionService.update(
          facilityCustomDetailOption
        )
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FacilityCustomDetailOption>>
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
   * @param facilityCustomDetailOption
   */
  protected updateForm(
    facilityCustomDetailOption: FacilityCustomDetailOption
  ): void {
    this.editForm.patchValue({
      id: facilityCustomDetailOption?.id,
      value: facilityCustomDetailOption?.value,
      label: facilityCustomDetailOption?.label
    });
  }

  /**
   * Return form values as object of type FacilityCustomDetailOption
   * @returns FacilityCustomDetailOption
   */
  protected createFromForm(): FacilityCustomDetailOption {
    return {
      ...new FacilityCustomDetailOption(),
      id: this.editForm.get(["id"])!.value,
      value: this.editForm.get(["value"])!.value,
      label: this.editForm.get(["label"])!.value
    };
  }
}
