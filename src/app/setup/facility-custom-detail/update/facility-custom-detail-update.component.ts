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
import { FacilityCustomDetail } from "../facility-custom-detail.model";
import { FacilityCustomDetailService } from "../facility-custom-detail.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-facility-custom-detail-update",
  templateUrl: "./facility-custom-detail-update.component.html",
})
export class FacilityCustomDetailUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    value_type: [null, [Validators.required]],
  });

  constructor(
    protected facilityCustomDetailService: FacilityCustomDetailService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create FacilityCustomDetail or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const facilityCustomDetail = this.createFromForm();
    if (facilityCustomDetail.id !== undefined) {
      this.subscribeToSaveResponse(
        this.facilityCustomDetailService.update(facilityCustomDetail)
      );
    } else {
      this.subscribeToSaveResponse(
        this.facilityCustomDetailService.create(facilityCustomDetail)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FacilityCustomDetail>>
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
   * @param facilityCustomDetail
   */
  protected updateForm(facilityCustomDetail: FacilityCustomDetail): void {
    this.editForm.patchValue({
      id: facilityCustomDetail.id,
      name: facilityCustomDetail.name,
      code: facilityCustomDetail.code,
      value_type: facilityCustomDetail.value_type,
    });
  }

  /**
   * Return form values as object of type FacilityCustomDetail
   * @returns FacilityCustomDetail
   */
  protected createFromForm(): FacilityCustomDetail {
    return {
      ...new FacilityCustomDetail(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      value_type: this.editForm.get(["value_type"])!.value,
    };
  }
}
