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
import { CategoryCombination } from 'src/app/setup/category-combination/category-combination.model';
import { CategoryCombinationService } from 'src/app/setup/category-combination/category-combination.service';
import { CategoryCategoryCombination } from '../category-category-combination.model';
import { CategoryCategoryCombinationService } from '../category-category-combination.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-category-category-combination-update',
  templateUrl: './category-category-combination-update.component.html',
})
export class CategoryCategoryCombinationUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  categories?: Category[] = [];
  categoryCombinations?: CategoryCombination[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    category_id: [null, [Validators.required]],
    category_combination_id: [null, []],
  });

  constructor(
    protected categoryCategoryCombinationService: CategoryCategoryCombinationService,
    protected categoryService: CategoryService,
    protected categoryCombinationService: CategoryCombinationService,
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
    this.categoryCombinationService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CategoryCombination[]>) =>
          (this.categoryCombinations = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CategoryCategoryCombination or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const categoryCategoryCombination = this.createFromForm();
    if (categoryCategoryCombination.id !== undefined) {
      this.subscribeToSaveResponse(
        this.categoryCategoryCombinationService.update(
          categoryCategoryCombination
        )
      );
    } else {
      this.subscribeToSaveResponse(
        this.categoryCategoryCombinationService.create(
          categoryCategoryCombination
        )
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CategoryCategoryCombination>>
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
   * @param categoryCategoryCombination
   */
  protected updateForm(
    categoryCategoryCombination: CategoryCategoryCombination
  ): void {
    this.editForm.patchValue({
      id: categoryCategoryCombination.id,
      category_id: categoryCategoryCombination.category_id,
      category_combination_id:
        categoryCategoryCombination.category_combination_id,
    });
  }

  /**
   * Return form values as object of type CategoryCategoryCombination
   * @returns CategoryCategoryCombination
   */
  protected createFromForm(): CategoryCategoryCombination {
    return {
      ...new CategoryCategoryCombination(),
      id: this.editForm.get(['id'])!.value,
      category_id: this.editForm.get(['category_id'])!.value,
      category_combination_id: this.editForm.get(['category_combination_id'])!
        .value,
    };
  }
}
