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
import { EnumService, PlanrepEnum } from "src/app/shared/enum.service";
import { GfsCodeCategory } from "../gfs-code-category.model";
import { GfsCodeCategoryService } from "../gfs-code-category.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-gfs-code-category-update",
  templateUrl: "./gfs-code-category-update.component.html",
})
export class GfsCodeCategoryUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  parents?: GfsCodeCategory[] = [];
  types?: PlanrepEnum[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    parent_id: [null, []],
    type: [null, [Validators.required]],
  });

  constructor(
    protected gfsCodeCategoryService: GfsCodeCategoryService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.gfsCodeCategoryService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<GfsCodeCategory[]>) => (this.parents = resp.data)
      );
    this.types = this.enumService.get("gfsCodeCategoryTypes");
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create GfsCodeCategory or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const gfsCodeCategory = this.createFromForm();
    if (gfsCodeCategory.id !== undefined) {
      this.subscribeToSaveResponse(
        this.gfsCodeCategoryService.update(gfsCodeCategory)
      );
    } else {
      this.subscribeToSaveResponse(
        this.gfsCodeCategoryService.create(gfsCodeCategory)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<GfsCodeCategory>>
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
   * @param gfsCodeCategory
   */
  protected updateForm(gfsCodeCategory: GfsCodeCategory): void {
    this.editForm.patchValue({
      id: gfsCodeCategory.id,
      name: gfsCodeCategory.name,
      parent_id: gfsCodeCategory.parent_id,
      type: gfsCodeCategory.type,
    });
  }

  /**
   * Return form values as object of type GfsCodeCategory
   * @returns GfsCodeCategory
   */
  protected createFromForm(): GfsCodeCategory {
    return {
      ...new GfsCodeCategory(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      parent_id: this.editForm.get(["parent_id"])!.value,
      type: this.editForm.get(["type"])!.value,
    };
  }
}
