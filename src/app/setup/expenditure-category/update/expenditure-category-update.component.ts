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
import { ActivityTaskNature } from 'src/app/setup/activity-task-nature/activity-task-nature.model';
import { ActivityTaskNatureService } from 'src/app/setup/activity-task-nature/activity-task-nature.service';
import { ProjectType } from 'src/app/setup/project-type/project-type.model';
import { ProjectTypeService } from 'src/app/setup/project-type/project-type.service';
import { ExpenditureCategory } from '../expenditure-category.model';
import { ExpenditureCategoryService } from '../expenditure-category.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-expenditure-category-update',
  templateUrl: './expenditure-category-update.component.html',
})
export class ExpenditureCategoryUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  activityTaskNatures?: ActivityTaskNature[] = [];
  projectTypes?: ProjectType[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    activity_task_nature_id: [null, [Validators.required]],
    project_type_id: [null, [Validators.required]],
    is_active: [false, []],
  });

  constructor(
    protected expenditureCategoryService: ExpenditureCategoryService,
    protected activityTaskNatureService: ActivityTaskNatureService,
    protected projectTypeService: ProjectTypeService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.activityTaskNatureService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<ActivityTaskNature[]>) =>
          (this.activityTaskNatures = resp.data)
      );
    this.projectTypeService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<ProjectType[]>) => (this.projectTypes = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ExpenditureCategory or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const expenditureCategory = this.createFromForm();
    if (expenditureCategory.id !== undefined) {
      this.subscribeToSaveResponse(
        this.expenditureCategoryService.update(expenditureCategory)
      );
    } else {
      this.subscribeToSaveResponse(
        this.expenditureCategoryService.create(expenditureCategory)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ExpenditureCategory>>
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
   * @param expenditureCategory
   */
  protected updateForm(expenditureCategory: ExpenditureCategory): void {
    this.editForm.patchValue({
      id: expenditureCategory.id,
      name: expenditureCategory.name,
      activity_task_nature_id: expenditureCategory.activity_task_nature_id,
      project_type_id: expenditureCategory.project_type_id,
      is_active: expenditureCategory.is_active,
    });
  }

  /**
   * Return form values as object of type ExpenditureCategory
   * @returns ExpenditureCategory
   */
  protected createFromForm(): ExpenditureCategory {
    return {
      ...new ExpenditureCategory(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      activity_task_nature_id: this.editForm.get(['activity_task_nature_id'])!
        .value,
      project_type_id: this.editForm.get(['project_type_id'])!.value,
      is_active: this.editForm.get(['is_active'])!.value,
    };
  }
}
