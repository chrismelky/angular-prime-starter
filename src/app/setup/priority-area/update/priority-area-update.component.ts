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
import { PriorityArea } from '../priority-area.model';
import { PriorityAreaService } from '../priority-area.service';
import { ToastService } from 'src/app/shared/toast.service';
import { SectorService } from '../../sector/sector.service';
import { ObjectiveService } from '../../objective/objective.service';
import { Sector } from '../../sector/sector.model';
import { Objective } from '../../objective/objective.model';

@Component({
  selector: 'app-priority-area-update',
  templateUrl: './priority-area-update.component.html',
})
export class PriorityAreaUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  sectors?: Sector[] = [];
  objectives?: Objective[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    number: [null, [Validators.required]],
    objectives: [[], []],
    sectors: [[], [Validators.required]],
  });

  constructor(
    protected priorityAreaService: PriorityAreaService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected sectorService: SectorService,
    protected objectiveService: ObjectiveService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
    this.sectorService
      .query({
        columns: ['id', 'name'],
      })
      .subscribe((resp) => (this.sectors = resp.data));

    this.objectiveService
      .query({
        columns: ['id', 'description', 'code'],
      })
      .subscribe((resp) => (this.objectives = resp.data));
  }

  /**
   * When form is valid Create PriorityArea or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const priorityArea = this.createFromForm();
    if (priorityArea.id !== undefined) {
      this.subscribeToSaveResponse(
        this.priorityAreaService.update(priorityArea)
      );
    } else {
      this.subscribeToSaveResponse(
        this.priorityAreaService.create(priorityArea)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<PriorityArea>>
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
   * @param priorityArea
   */
  protected updateForm(priorityArea: PriorityArea): void {
    this.editForm.patchValue({
      id: priorityArea.id,
      description: priorityArea.description,
      number: priorityArea.number,
      sectors: priorityArea.sectors,
      objectives: priorityArea.objectives,
    });
  }

  /**
   * Return form values as object of type PriorityArea
   * @returns PriorityArea
   */
  protected createFromForm(): PriorityArea {
    return {
      ...new PriorityArea(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      number: this.editForm.get(['number'])!.value,
      sectors: this.editForm.get(['sectors'])!.value,
      objectives: this.editForm.get(['objectives'])!.value,
    };
  }
}
