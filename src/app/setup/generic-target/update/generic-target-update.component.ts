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
import { Objective } from 'src/app/setup/objective/objective.model';
import { ObjectiveService } from 'src/app/setup/objective/objective.service';
import { PlanningMatrix } from 'src/app/setup/planning-matrix/planning-matrix.model';
import { PlanningMatrixService } from 'src/app/setup/planning-matrix/planning-matrix.service';
import { GenericTarget } from '../generic-target.model';
import { GenericTargetService } from '../generic-target.service';
import { ToastService } from 'src/app/shared/toast.service';
import { Section } from '../../section/section.model';
import { PerformanceIndicator } from '../../performance-indicator/performance-indicator.model';
import { PerformanceIndicatorService } from '../../performance-indicator/performance-indicator.service';
import { SectionService } from '../../section/section.service';

@Component({
  selector: 'app-generic-target-update',
  templateUrl: './generic-target-update.component.html',
})
export class GenericTargetUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  objectives?: Objective[] = [];
  planningMatrices?: PlanningMatrix[] = [];
  sections?: Section[] = [];
  indicators?: PerformanceIndicator[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    params: [null, []],
    objective_id: [null, [Validators.required]],
    planning_matrix_id: [null, [Validators.required]],
    is_active: [false, []],
    sections: [[], [Validators.required]],
    indicators: [[], [Validators.required]],
  });

  constructor(
    protected genericTargetService: GenericTargetService,
    protected objectiveService: ObjectiveService,
    protected planningMatrixService: PlanningMatrixService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    protected indicatorService: PerformanceIndicatorService,
    protected sectionService: SectionService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const dialogData = this.dialogConfig.data;
    this.sectionService.departments().subscribe(
      (resp) => {
        this.sections = resp.data;
      },
      (error) => {}
    );
    this.indicatorService
      .query({
        column: ['id', 'description'],
        objective_id: dialogData.objective_id,
      })
      .subscribe(
        (resp) => {
          this.indicators = resp.data;
        },
        (error) => {}
      );
    this.updateForm(dialogData); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create GenericTarget or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const genericTarget = this.createFromForm();
    if (genericTarget.id !== undefined) {
      this.subscribeToSaveResponse(
        this.genericTargetService.update(genericTarget)
      );
    } else {
      this.subscribeToSaveResponse(
        this.genericTargetService.create(genericTarget)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<GenericTarget>>
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
   * @param genericTarget
   */
  protected updateForm(genericTarget: GenericTarget): void {
    this.editForm.patchValue({
      id: genericTarget.id,
      description: genericTarget.description,
      params: genericTarget.params,
      objective_id: genericTarget.objective_id,
      planning_matrix_id: genericTarget.planning_matrix_id,
      is_active: genericTarget.is_active,
      sections: genericTarget.sections,
      indicators: genericTarget.indicators,
    });
  }

  /**
   * Return form values as object of type GenericTarget
   * @returns GenericTarget
   */
  protected createFromForm(): GenericTarget {
    return {
      ...new GenericTarget(),
      ...this.editForm.value,
    };
  }
}
