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
import { CategoryCombination } from '../category-combination.model';
import { CategoryCombinationService } from '../category-combination.service';
import { ToastService } from 'src/app/shared/toast.service';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/category.model';
import { CategoryCategoryCombination } from '../../category-category-combination/category-category-combination.model';

@Component({
  selector: 'app-category-combination-update',
  templateUrl: './category-combination-update.component.html',
})
export class CategoryCombinationUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  newCategoryCombCategories?: CategoryCategoryCombination[] = [];
  existingCategoryCombCategories?: CategoryCategoryCombination[] = [];

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
    protected categoryService: CategoryService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.existingCategoryCombCategories =
      this.dialogConfig.data.category_category_combinations ?? [];
    const existingCatIds = this.existingCategoryCombCategories?.map(
      (c) => c.category_id
    );
    this.categoryService
      .query({ columns: ['id', 'name'] })
      .subscribe((resp) => {
        this.newCategoryCombCategories = (resp.data ?? [])
          .filter((c) => existingCatIds?.indexOf(c.id) === -1)
          .map((c) => {
            return {
              category: c,
              category_id: c.id,
              category_combination_id: this.dialogConfig.data.id,
            };
          });
      });
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CategoryCombination Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    let categoryCombination = this.createFromForm();
    categoryCombination.category_category_combinations =
      this.existingCategoryCombCategories;
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
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      skip_total: this.editForm.get(['skip_total'])!.value,
    };
  }
}
