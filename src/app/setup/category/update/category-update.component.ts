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
import { CategoryCombination } from 'src/app/setup/category-combination/category-combination.model';
import { CategoryCombinationService } from 'src/app/setup/category-combination/category-combination.service';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
})
export class CategoryUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  categoryCombinations?: CategoryCombination[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    category_combination_id: [null, [Validators.required]],
  });

  constructor(
    protected categoryService: CategoryService,
    protected categoryCombinationService: CategoryCombinationService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.categoryCombinationService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CategoryCombination[]>) =>
          (this.categoryCombinations = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create Category Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const category = this.createFromForm();
    if (category.id !== undefined) {
      this.subscribeToSaveResponse(this.categoryService.update(category));
    } else {
      this.subscribeToSaveResponse(this.categoryService.create(category));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Category>>
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
   * @param category
   */
  protected updateForm(category: Category): void {
    this.editForm.patchValue({
      id: category.id,
      name: category.name,
      code: category.code,
      category_combination_id: category.category_combination_id,
    });
  }

  /**
   * Return form values as object of type Category
   * @returns Category
   */
  protected createFromForm(): Category {
    return {
      ...new Category(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      category_combination_id: this.editForm.get(['category_combination_id'])!
        .value,
    };
  }
}
