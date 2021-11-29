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
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { PerformanceIndicator } from '../performance-indicator.model';
import { PerformanceIndicatorService } from '../performance-indicator.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-performance-indicator-update',
  templateUrl: './performance-indicator-update.component.html',
})
export class PerformanceIndicatorUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  objectives?: Objective[] = [];
  sections?: Section[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    number: [null, []],
    objective_id: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
    is_qualitative: [false, []],
    less_is_good: [false, []],
    is_active: [false, []],
    data_source: [false, []],
  });

  constructor(
    protected performanceIndicatorService: PerformanceIndicatorService,
    protected objectiveService: ObjectiveService,
    protected sectionService: SectionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const data = this.dialogConfig.data;
    this.objectives = data.objectives;
    this.sections = data.sections;
    this.updateForm(data.indicator); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create PerformanceIndicator or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const performanceIndicator = this.createFromForm();
    if (performanceIndicator.id !== undefined) {
      this.subscribeToSaveResponse(
        this.performanceIndicatorService.update(performanceIndicator)
      );
    } else {
      this.subscribeToSaveResponse(
        this.performanceIndicatorService.create(performanceIndicator)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<PerformanceIndicator>>
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
   * @param performanceIndicator
   */
  protected updateForm(performanceIndicator: PerformanceIndicator): void {
    this.editForm.patchValue({
      id: performanceIndicator.id,
      description: performanceIndicator.description,
      number: performanceIndicator.number,
      objective_id: performanceIndicator.objective_id,
      section_id: performanceIndicator.section_id,
      is_qualitative: performanceIndicator.is_qualitative,
      less_is_good: performanceIndicator.less_is_good,
      is_active: performanceIndicator.is_active,
      data_source: performanceIndicator.data_source,
    });
  }

  /**
   * Return form values as object of type PerformanceIndicator
   * @returns PerformanceIndicator
   */
  protected createFromForm(): PerformanceIndicator {
    return {
      ...new PerformanceIndicator(),
      ...this.editForm.value,
    };
  }
}
