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
import { CategoryCombination } from "../category-combination.model";
import { CategoryCombinationService } from "../category-combination.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-category-combination-update",
  templateUrl: "./category-combination-update.component.html",
})
export class CategoryCombinationUpdateComponent implements OnInit {
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
    skip_total: [false, [Validators.required]],
  });

  constructor(
    protected categoryCombinationService: CategoryCombinationService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CategoryCombination or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const categoryCombination = this.createFromForm();
    if (categoryCombination.id !== undefined) {
      this.subscribeToSaveResponse(
        this.categoryCombinationService.update(categoryCombination)
      );
    } else {
      this.subscribeToSaveResponse(
        this.categoryCombinationService.create(categoryCombination)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CategoryCombination>>
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
   * @param categoryCombination
   */
  protected updateForm(categoryCombination: CategoryCombination): void {
    this.editForm.patchValue({
      id: categoryCombination.id,
      name: categoryCombination.name,
      code: categoryCombination.code,
      skip_total: categoryCombination.skip_total,
    });
  }

  /**
   * Return form values as object of type CategoryCombination
   * @returns CategoryCombination
   */
  protected createFromForm(): CategoryCombination {
    return {
      ...new CategoryCombination(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      skip_total: this.editForm.get(["skip_total"])!.value,
    };
  }
}
