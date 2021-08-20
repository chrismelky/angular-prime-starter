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
import { AssetUse } from "../asset-use.model";
import { AssetUseService } from "../asset-use.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-asset-use-update",
  templateUrl: "./asset-use-update.component.html",
})
export class AssetUseUpdateComponent implements OnInit {
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
    protected assetUseService: AssetUseService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create AssetUse or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const assetUse = this.createFromForm();
    if (assetUse.id !== undefined) {
      this.subscribeToSaveResponse(this.assetUseService.update(assetUse));
    } else {
      this.subscribeToSaveResponse(this.assetUseService.create(assetUse));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<AssetUse>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and dispaly info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handiling specific to this component
   * Note; general error handleing is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param assetUse
   */
  protected updateForm(assetUse: AssetUse): void {
    this.editForm.patchValue({
      id: assetUse.id,
      name: assetUse.name,
      code: assetUse.code,
    });
  }

  /**
   * Return form values as object of type AssetUse
   * @returns AssetUse
   */
  protected createFromForm(): AssetUse {
    return {
      ...new AssetUse(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
    };
  }
}
