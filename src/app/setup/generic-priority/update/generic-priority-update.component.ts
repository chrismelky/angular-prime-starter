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
import { PlanningMatrix } from 'src/app/setup/planning-matrix/planning-matrix.model';
import { PlanningMatrixService } from 'src/app/setup/planning-matrix/planning-matrix.service';
import { GenericPriority } from '../generic-priority.model';
import { GenericPriorityService } from '../generic-priority.service';
import { ToastService } from 'src/app/shared/toast.service';
import { Sector } from '../../sector/sector.model';
import { SectorService } from '../../sector/sector.service';

@Component({
  selector: 'app-generic-priority-update',
  templateUrl: './generic-priority-update.component.html',
})
export class GenericPriorityUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  sectors?: Sector[] = [];
  planningMatrices?: PlanningMatrix[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    params: [null, [Validators.required]],
    planning_matrix_id: [null, [Validators.required]],
    is_active: [true, []],
    sectors: [[], [Validators.required]],
  });

  constructor(
    protected genericPriorityService: GenericPriorityService,
    protected planningMatrixService: PlanningMatrixService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected sectorService: SectorService
  ) {}

  ngOnInit(): void {
    this.planningMatrixService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<PlanningMatrix[]>) =>
          (this.planningMatrices = resp.data)
      );
    this.sectorService
      .query({
        columns: ['id', 'name'],
      })
      .subscribe((resp) => {
        this.sectors = resp.data;
      });
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create GenericPriority or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const genericPriority = this.createFromForm();
    if (genericPriority.id !== undefined) {
      this.subscribeToSaveResponse(
        this.genericPriorityService.update(genericPriority)
      );
    } else {
      this.subscribeToSaveResponse(
        this.genericPriorityService.create(genericPriority)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<GenericPriority>>
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
   * @param genericPriority
   */
  protected updateForm(genericPriority: GenericPriority): void {
    this.editForm.patchValue({
      id: genericPriority.id,
      description: genericPriority.description,
      params: genericPriority.params,
      planning_matrix_id: genericPriority.planning_matrix_id,
      is_active: genericPriority.is_active,
      sectors: genericPriority.sectors,
    });
  }

  /**
   * Return form values as object of type GenericPriority
   * @returns GenericPriority
   */
  protected createFromForm(): GenericPriority {
    return {
      ...new GenericPriority(),
      ...this.editForm.value,
    };
  }
}
