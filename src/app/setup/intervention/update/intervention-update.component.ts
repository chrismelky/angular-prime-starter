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
import { InterventionCategory } from 'src/app/setup/intervention-category/intervention-category.model';
import { InterventionCategoryService } from 'src/app/setup/intervention-category/intervention-category.service';
import { PriorityArea } from 'src/app/setup/priority-area/priority-area.model';
import { PriorityAreaService } from 'src/app/setup/priority-area/priority-area.service';
import { Intervention } from '../intervention.model';
import { InterventionService } from '../intervention.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-intervention-update',
  templateUrl: './intervention-update.component.html',
})
export class InterventionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  interventionCategories?: InterventionCategory[] = [];
  priorityAreas?: PriorityArea[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    intervention_category_id: [null, [Validators.required]],
    priority_area_id: [null, [Validators.required]],
    is_primary: [false, [Validators.required]],
  });

  constructor(
    protected interventionService: InterventionService,
    protected interventionCategoryService: InterventionCategoryService,
    protected priorityAreaService: PriorityAreaService,
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
          (this.interventionCategories = resp.data)
      );
    const dialogData = this.dialogConfig.data;

    this.priorityAreas = dialogData.priorityAreas;
    this.updateForm(dialogData.intervention); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create Intervention or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const intervention = this.createFromForm();
    if (intervention.id !== undefined) {
      this.subscribeToSaveResponse(
        this.interventionService.update(intervention)
      );
    } else {
      this.subscribeToSaveResponse(
        this.interventionService.create(intervention)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Intervention>>
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
   * @param intervention
   */
  protected updateForm(intervention: Intervention): void {
    this.editForm.patchValue({
      id: intervention.id,
      description: intervention.description,
      intervention_category_id: intervention.intervention_category_id,
      priority_area_id: intervention.priority_area_id,
      is_primary: intervention.is_primary,
    });
  }

  /**
   * Return form values as object of type Intervention
   * @returns Intervention
   */
  protected createFromForm(): Intervention {
    return {
      ...new Intervention(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      intervention_category_id: this.editForm.get(['intervention_category_id'])!
        .value,
      priority_area_id: this.editForm.get(['priority_area_id'])!.value,
      is_primary: this.editForm.get(['is_primary'])!.value,
    };
  }
}
