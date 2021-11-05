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
import { PriorityArea } from 'src/app/setup/priority-area/priority-area.model';
import { PriorityAreaService } from 'src/app/setup/priority-area/priority-area.service';
import { PlanningMatrix } from 'src/app/setup/planning-matrix/planning-matrix.model';
import { PlanningMatrixService } from 'src/app/setup/planning-matrix/planning-matrix.service';
import { GenericSectorProblem } from '../generic-sector-problem.model';
import { GenericSectorProblemService } from '../generic-sector-problem.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-generic-sector-problem-update',
  templateUrl: './generic-sector-problem-update.component.html',
})
export class GenericSectorProblemUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  priorityAreas?: PriorityArea[] = [];
  planningMatrices?: PlanningMatrix[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    code: [null, [Validators.required]],
    description: [null, [Validators.required]],
    params: [null, []],
    priority_area_id: [null, [Validators.required]],
    planning_matrix_id: [null, [Validators.required]],
  });

  constructor(
    protected genericSectorProblemService: GenericSectorProblemService,
    protected priorityAreaService: PriorityAreaService,
    protected planningMatrixService: PlanningMatrixService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.priorityAreaService
      .query({ columns: ['id', 'description'] })
      .subscribe(
        (resp: CustomResponse<PriorityArea[]>) =>
          (this.priorityAreas = resp.data)
      );
    this.planningMatrixService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<PlanningMatrix[]>) =>
          (this.planningMatrices = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create GenericSectorProblem or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const genericSectorProblem = this.createFromForm();
    if (genericSectorProblem.id !== undefined) {
      this.subscribeToSaveResponse(
        this.genericSectorProblemService.update(genericSectorProblem)
      );
    } else {
      this.subscribeToSaveResponse(
        this.genericSectorProblemService.create(genericSectorProblem)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<GenericSectorProblem>>
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
   * @param genericSectorProblem
   */
  protected updateForm(genericSectorProblem: GenericSectorProblem): void {
    this.editForm.patchValue({
      id: genericSectorProblem.id,
      code: genericSectorProblem.code,
      description: genericSectorProblem.description,
      params: genericSectorProblem.params,
      priority_area_id: genericSectorProblem.priority_area_id,
      planning_matrix_id: genericSectorProblem.planning_matrix_id,
    });
  }

  /**
   * Return form values as object of type GenericSectorProblem
   * @returns GenericSectorProblem
   */
  protected createFromForm(): GenericSectorProblem {
    return {
      ...new GenericSectorProblem(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      description: this.editForm.get(['description'])!.value,
      params: this.editForm.get(['params'])!.value,
      priority_area_id: this.editForm.get(['priority_area_id'])!.value,
      planning_matrix_id: this.editForm.get(['planning_matrix_id'])!.value,
    };
  }
}
