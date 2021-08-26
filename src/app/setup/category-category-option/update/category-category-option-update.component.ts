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
import { Category } from 'src/app/setup/category/category.model';
import { CategoryService } from 'src/app/setup/category/category.service';
import { CategoryOption } from 'src/app/setup/category-option/category-option.model';
import { CategoryOptionService } from 'src/app/setup/category-option/category-option.service';
import { CategoryCategoryOption } from '../category-category-option.model';
import { CategoryCategoryOptionService } from '../category-category-option.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-category-category-option-update',
  templateUrl: './category-category-option-update.component.html',
})
export class CategoryCategoryOptionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  categories?: Category[] = [];
  categoryOptions?: CategoryOption[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    category_id: [null, [Validators.required]],
    category_option_id: [null, [Validators.required]],
    sort_order: [null, [Validators.required]],
  });

  constructor(
    protected categoryCategoryOptionService: CategoryCategoryOptionService,
    protected categoryService: CategoryService,
    protected categoryOptionService: CategoryOptionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.categoryService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Category[]>) => (this.categories = resp.data)
      );
    this.categoryOptionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CategoryOption[]>) =>
          (this.categoryOptions = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CategoryCategoryOption Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const categoryCategoryOption = this.createFromForm();
    if (categoryCategoryOption.id !== undefined) {
      this.subscribeToSaveResponse(
        this.categoryCategoryOptionService.update(categoryCategoryOption)
      );
    } else {
      this.subscribeToSaveResponse(
        this.categoryCategoryOptionService.create(categoryCategoryOption)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CategoryCategoryOption>>
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
   * @param categoryCategoryOption
   */
  protected updateForm(categoryCategoryOption: CategoryCategoryOption): void {
    this.editForm.patchValue({
      id: categoryCategoryOption.id,
      category_id: categoryCategoryOption.category_id,
      category_option_id: categoryCategoryOption.category_option_id,
      sort_order: categoryCategoryOption.sort_order,
    });
  }

  /**
   * Return form values as object of type CategoryCategoryOption
   * @returns CategoryCategoryOption
   */
  protected createFromForm(): CategoryCategoryOption {
    return {
      ...new CategoryCategoryOption(),
      id: this.editForm.get(['id'])!.value,
      category_id: this.editForm.get(['category_id'])!.value,
      category_option_id: this.editForm.get(['category_option_id'])!.value,
      sort_order: this.editForm.get(['sort_order'])!.value,
    };
  }
}
