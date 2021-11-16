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
import { InterventionCategory } from '../intervention-category.model';
import { InterventionCategoryService } from '../intervention-category.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-intervention-category-update',
  templateUrl: './intervention-category-update.component.html',
})
export class InterventionCategoryUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  parents?: InterventionCategory[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
  });

  constructor(
    protected interventionCategoryService: InterventionCategoryService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.interventionCategoryService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<InterventionCategory[]>) =>
          (this.parents = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create InterventionCategory or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const interventionCategory = this.createFromForm();
    if (interventionCategory.id !== undefined) {
      this.subscribeToSaveResponse(
        this.interventionCategoryService.update(interventionCategory)
      );
    } else {
      this.subscribeToSaveResponse(
        this.interventionCategoryService.create(interventionCategory)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<InterventionCategory>>
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
   * @param interventionCategory
   */
  protected updateForm(interventionCategory: InterventionCategory): void {
    this.editForm.patchValue({
      id: interventionCategory.id,
      name: interventionCategory.name,
    });
  }

  /**
   * Return form values as object of type InterventionCategory
   * @returns InterventionCategory
   */
  protected createFromForm(): InterventionCategory {
    return {
      ...new InterventionCategory(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
