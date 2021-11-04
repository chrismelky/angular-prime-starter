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
import { Objective } from '../objective.model';
import { ObjectiveService } from '../objective.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-objective-update',
  templateUrl: './objective-update.component.html',
})
export class ObjectiveUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    code: [
      null,
      [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
    ],
    description: [null, [Validators.required]],
  });

  constructor(
    protected objectiveService: ObjectiveService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create Objective or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const objective = this.createFromForm();
    if (objective.id !== undefined) {
      this.subscribeToSaveResponse(this.objectiveService.update(objective));
    } else {
      this.subscribeToSaveResponse(this.objectiveService.create(objective));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Objective>>
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
   * @param objective
   */
  protected updateForm(objective: Objective): void {
    this.editForm.patchValue({
      id: objective.id,
      code: objective.code,
      description: objective.description,
    });
  }

  /**
   * Return form values as object of type Objective
   * @returns Objective
   */
  protected createFromForm(): Objective {
    return {
      ...new Objective(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
