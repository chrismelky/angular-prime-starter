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
import { OptionSet } from "src/app/setup/option-set/option-set.model";
import { OptionSetService } from "src/app/setup/option-set/option-set.service";
import { OptionSetValue } from "../option-set-value.model";
import { OptionSetValueService } from "../option-set-value.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-option-set-value-update",
  templateUrl: "./option-set-value-update.component.html",
})
export class OptionSetValueUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  optionSets?: OptionSet[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    sort_order: [null, []],
    option_set_id: [null, [Validators.required]],
  });

  constructor(
    protected optionSetValueService: OptionSetValueService,
    protected optionSetService: OptionSetService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.optionSetService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<OptionSet[]>) => (this.optionSets = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create OptionSetValue or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const optionSetValue = this.createFromForm();
    if (optionSetValue.id !== undefined) {
      this.subscribeToSaveResponse(
        this.optionSetValueService.update(optionSetValue)
      );
    } else {
      this.subscribeToSaveResponse(
        this.optionSetValueService.create(optionSetValue)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<OptionSetValue>>
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
   * @param optionSetValue
   */
  protected updateForm(optionSetValue: OptionSetValue): void {
    this.editForm.patchValue({
      id: optionSetValue.id,
      name: optionSetValue.name,
      code: optionSetValue.code,
      sort_order: optionSetValue.sort_order,
      option_set_id: optionSetValue.option_set_id,
    });
  }

  /**
   * Return form values as object of type OptionSetValue
   * @returns OptionSetValue
   */
  protected createFromForm(): OptionSetValue {
    return {
      ...new OptionSetValue(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      sort_order: this.editForm.get(["sort_order"])!.value,
      option_set_id: this.editForm.get(["option_set_id"])!.value,
    };
  }
}
