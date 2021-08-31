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
import { TransportCategory } from "../transport-category.model";
import { TransportCategoryService } from "../transport-category.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-transport-category-update",
  templateUrl: "./transport-category-update.component.html",
})
export class TransportCategoryUpdateComponent implements OnInit {
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
  });

  constructor(
    protected transportCategoryService: TransportCategoryService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create TransportCategory or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const transportCategory = this.createFromForm();
    if (transportCategory.id !== undefined) {
      this.subscribeToSaveResponse(
        this.transportCategoryService.update(transportCategory)
      );
    } else {
      this.subscribeToSaveResponse(
        this.transportCategoryService.create(transportCategory)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<TransportCategory>>
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
   * @param transportCategory
   */
  protected updateForm(transportCategory: TransportCategory): void {
    this.editForm.patchValue({
      id: transportCategory.id,
      name: transportCategory.name,
      code: transportCategory.code,
    });
  }

  /**
   * Return form values as object of type TransportCategory
   * @returns TransportCategory
   */
  protected createFromForm(): TransportCategory {
    return {
      ...new TransportCategory(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
    };
  }
}
