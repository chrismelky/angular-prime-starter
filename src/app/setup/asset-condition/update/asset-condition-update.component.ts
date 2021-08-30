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
import { AssetCondition } from '../asset-condition.model';
import { AssetConditionService } from '../asset-condition.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-asset-condition-update',
  templateUrl: './asset-condition-update.component.html',
})
export class AssetConditionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    code: [null, [Validators.required, Validators.maxLength(100)]],
  });

  constructor(
    protected assetConditionService: AssetConditionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create AssetCondition or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const assetCondition = this.createFromForm();
    if (assetCondition.id !== undefined) {
      this.subscribeToSaveResponse(
        this.assetConditionService.update(assetCondition)
      );
    } else {
      this.subscribeToSaveResponse(
        this.assetConditionService.create(assetCondition)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<AssetCondition>>
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
   * @param assetCondition
   */
  protected updateForm(assetCondition: AssetCondition): void {
    this.editForm.patchValue({
      id: assetCondition.id,
      name: assetCondition.name,
      code: assetCondition.code,
    });
  }

  /**
   * Return form values as object of type AssetCondition
   * @returns AssetCondition
   */
  protected createFromForm(): AssetCondition {
    return {
      ...new AssetCondition(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
    };
  }
}
