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
import { CategoryOption } from '../category-option.model';
import { CategoryOptionService } from '../category-option.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-category-option-update',
  templateUrl: './category-option-update.component.html',
})
export class CategoryOptionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    short_name: [null, [Validators.required]],
    code: [null, [Validators.required]],
  });

  constructor(
    protected categoryOptionService: CategoryOptionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CategoryOption Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const categoryOption = this.createFromForm();
    if (categoryOption.id !== undefined) {
      this.subscribeToSaveResponse(
        this.categoryOptionService.update(categoryOption)
      );
    } else {
      this.subscribeToSaveResponse(
        this.categoryOptionService.create(categoryOption)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CategoryOption>>
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
   * @param categoryOption
   */
  protected updateForm(categoryOption: CategoryOption): void {
    this.editForm.patchValue({
      id: categoryOption.id,
      name: categoryOption.name,
      short_name: categoryOption.short_name,
      code: categoryOption.code,
    });
  }

  /**
   * Return form values as object of type CategoryOption
   * @returns CategoryOption
   */
  protected createFromForm(): CategoryOption {
    return {
      ...new CategoryOption(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      short_name: this.editForm.get(['short_name'])!.value,
      code: this.editForm.get(['code'])!.value,
    };
  }
}
