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
import { CategoryOptionCombination } from '../category-option-combination.model';
import { CategoryOptionCombinationService } from '../category-option-combination.service';
import { ToastService } from 'src/app/shared/toast.service';
import { OptionSetService } from '../../option-set/option-set.service';
import { EnumService, PlanrepEnum } from 'src/app/shared/enum.service';
import { OptionSet } from '../../option-set/option-set.model';
import { CategoryCombination } from '../../category-combination/category-combination.model';

@Component({
  selector: 'app-category-option-combination-update',
  templateUrl: './category-option-combination-update.component.html',
})
export class CategoryOptionCombinationUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  optionSets?: OptionSet[] = [];
  valueTypes?: PlanrepEnum[] = [];
  lastExpression?: string;
  existingOptionCombos?: CategoryOptionCombination[] = [];
  categoryCombinations?: CategoryCombination[] = [];
  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, []],
    option_set_id: [null, []],
    sort_order: [null, []],
    value_type: [null, []],
    is_calculated: [null, []],
    formular: [null, []],
    validFormular: [null, []],
  });

  constructor(
    protected categoryOptionCombinationService: CategoryOptionCombinationService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    protected optionSetService: OptionSetService,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.optionSetService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<OptionSet[]>) => (this.optionSets = resp.data)
      );
    const dialogData = this.dialogConfig.data;
    this.existingOptionCombos = dialogData.existingOptionCombos || [];
    this.categoryCombinations = dialogData.categoryCombinations || [];
    this.valueTypes = this.enumService.get('valueTypes');
    this.updateForm(dialogData.categoryOptionCombination); //Initialize form with data from dialog
    this.updateFormularValidity();
  }

  /**
   * When form is valid Create CategoryOptionCombination or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const categoryOptionCombination = this.createFromForm();
    if (categoryOptionCombination.id !== undefined) {
      this.subscribeToSaveResponse(
        this.categoryOptionCombinationService.update(categoryOptionCombination)
      );
    } else {
      const data = {
        ...categoryOptionCombination,
        category_combinations: this.categoryCombinations,
      };
      this.subscribeToSaveResponse(
        this.categoryOptionCombinationService.create(data)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CategoryOptionCombination>>
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

  addFormular(expression: string): void {
    let existing = this.editForm.get('formular')?.value || '';
    existing = existing + ' [ ' + expression + ' ]';
    this.editForm.patchValue({
      formular: existing,
    });
    this.lastExpression = expression;
    this.checkFormular();
  }

  clear(): void {
    let existing = this.editForm.get('formular')?.value || '';
    const lastIndex = existing.lastIndexOf('[');
    existing = existing.substring(0, lastIndex);

    this.editForm.patchValue({
      formular: existing,
    });
    this.checkFormular();
  }

  private checkFormular(): void {
    let existing = this.editForm.get('formular')?.value || '';

    this.existingOptionCombos?.forEach((coc) => {
      existing = existing.replaceAll(coc.name, 1);
    });
    existing = existing.replaceAll('[', '');
    existing = existing.replaceAll(']', '');

    try {
      eval(existing);
      this.editForm.get('validFormular')?.clearValidators();
    } catch (error) {
      this.editForm.get('validFormular')?.setValidators([Validators.required]);
    }
    this.editForm.get('validFormular')?.updateValueAndValidity();
  }

  updateFormularValidity(): void {
    if (this.editForm.get('is_calculated')?.value === true) {
      this.editForm.get('formular')?.setValidators([Validators.required]);
      this.editForm.get('name')?.enable();
    } else {
      this.editForm.get('formular')?.clearValidators();
      this.editForm.get('name')?.disable();
    }
    this.editForm.get('formular')?.updateValueAndValidity();
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
   * @param categoryOptionCombination
   */
  protected updateForm(
    categoryOptionCombination: CategoryOptionCombination
  ): void {
    this.editForm.patchValue({
      id: categoryOptionCombination.id,
      name: categoryOptionCombination.name,
      code: categoryOptionCombination.code,
      sort_order: categoryOptionCombination.sort_order,
      value_type: categoryOptionCombination.value_type,
      option_set_id: categoryOptionCombination.option_set_id,
      is_calculated: categoryOptionCombination.is_calculated,
      formular: categoryOptionCombination.formular,
    });
  }

  /**
   * Return form values as object of type CategoryOptionCombination
   * @returns CategoryOptionCombination
   */
  protected createFromForm(): CategoryOptionCombination {
    return {
      ...new CategoryOptionCombination(),
      ...this.editForm.value,
      name: this.editForm.get('name')?.value,
    };
  }
}
