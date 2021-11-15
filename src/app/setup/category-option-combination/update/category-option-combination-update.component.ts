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

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [{ value: null, disabled: true }, [Validators.required]],
    code: [null, []],
    option_set_id: [null, []],
    sort_order: [null, []],
    value_type: [null, []],
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
    this.valueTypes = this.enumService.get('valueTypes');
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
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
      this.subscribeToSaveResponse(
        this.categoryOptionCombinationService.create(categoryOptionCombination)
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
    });
  }

  /**
   * Return form values as object of type CategoryOptionCombination
   * @returns CategoryOptionCombination
   */
  protected createFromForm(): CategoryOptionCombination {
    return {
      ...new CategoryOptionCombination(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      sort_order: this.editForm.get(['sort_order'])!.value,
      value_type: this.editForm.get(['value_type'])!.value,
      option_set_id: this.editForm.get(['option_set_id'])!.value,
    };
  }
}
