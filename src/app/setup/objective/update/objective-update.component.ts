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
import { ObjectiveType } from '../../objective-type/objective-type.model';
import { Sector } from '../../sector/sector.model';
import { SectorService } from '../../sector/sector.service';

@Component({
  selector: 'app-objective-update',
  templateUrl: './objective-update.component.html',
})
export class ObjectiveUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  parents?: Objective[] = [];
  objectiveType?: ObjectiveType;
  sectors?: Sector[] = [];
  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    code: [null, []],
    description: [null, [Validators.required]],
    parent_id: [null, []],
    objective_type_id: [null, [Validators.required]],
    sectors: [[]],
  });

  constructor(
    protected objectiveService: ObjectiveService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected sectorService: SectorService
  ) {}

  ngOnInit(): void {
    const dialogData = this.dialogConfig.data;
    this.parents = dialogData.parents;
    this.updateForm(dialogData.objectiveData); //Initialize form with data from dialog
    this.objectiveType = dialogData.objectiveType;
    if (this.objectiveType?.is_sectoral) {
      this.sectorService
        .query({
          columns: ['id', 'name'],
        })
        .subscribe((resp) => {
          this.sectors = resp.data;
        });
    }
    this.updateCodeValiditation();
    this.updateSectorValiditation();
  }

  /**
   * When form is valid Create Objective or Update if exist else set form has error and return
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

  private updateCodeValiditation(): void {
    if (this.objectiveType?.is_incremental) {
      this.editForm.get('code')?.clearValidators();
    } else {
      this.editForm
        .get('code')
        ?.setValidators([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ]);
    }
    this.editForm.get('code')?.updateValueAndValidity();
  }

  private updateSectorValiditation(): void {
    if (this.objectiveType?.is_sectoral) {
      this.editForm.get('sectors')?.setValidators([Validators.required]);
    } else {
      this.editForm.get('sectors')?.clearValidators();
      this.editForm.patchValue({
        sectors: [],
      });
    }
    this.editForm.get('sectors')?.updateValueAndValidity();
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
      parent_id: objective.parent_id,
      objective_type_id: objective.objective_type_id,
      sectors: objective.sectors,
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
      objective_type_id: this.editForm.get(['objective_type_id'])!.value,
      parent_id: this.editForm.get(['parent_id'])!.value,
      sectors: this.editForm.get(['sectors'])!.value,
    };
  }
}
