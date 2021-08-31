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
import { PeSelectOption } from "../pe-select-option.model";
import { PeSelectOptionService } from "../pe-select-option.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-pe-select-option-update",
  templateUrl: "./pe-select-option-update.component.html",
})
export class PeSelectOptionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  parents?: PeSelectOption[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, []],
    parent_id: [null, []],
    is_active: [false, []],
  });

  constructor(
    protected peSelectOptionService: PeSelectOptionService,
    protected parentService: PeSelectOptionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.parentService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<PeSelectOption[]>) => (this.parents = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create PeSelectOption or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const peSelectOption = this.createFromForm();
    if (peSelectOption.id !== undefined) {
      this.subscribeToSaveResponse(
        this.peSelectOptionService.update(peSelectOption)
      );
    } else {
      this.subscribeToSaveResponse(
        this.peSelectOptionService.create(peSelectOption)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<PeSelectOption>>
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
   * @param peSelectOption
   */
  protected updateForm(peSelectOption: PeSelectOption): void {
    this.editForm.patchValue({
      id: peSelectOption.id,
      name: peSelectOption.name,
      code: peSelectOption.code,
      parent_id: peSelectOption.parent_id,
      is_active: peSelectOption.is_active,
    });
  }

  /**
   * Return form values as object of type PeSelectOption
   * @returns PeSelectOption
   */
  protected createFromForm(): PeSelectOption {
    return {
      ...new PeSelectOption(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      parent_id: this.editForm.get(["parent_id"])!.value,
      is_active: this.editForm.get(["is_active"])!.value,
    };
  }
}
