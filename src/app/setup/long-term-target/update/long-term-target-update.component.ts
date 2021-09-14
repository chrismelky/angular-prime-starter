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
import { StrategicPlan } from 'src/app/setup/strategic-plan/strategic-plan.model';
import { StrategicPlanService } from 'src/app/setup/strategic-plan/strategic-plan.service';
import { Objective } from 'src/app/setup/objective/objective.model';
import { ObjectiveService } from 'src/app/setup/objective/objective.service';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { LongTermTarget } from '../long-term-target.model';
import { LongTermTargetService } from '../long-term-target.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-long-term-target-update',
  templateUrl: './long-term-target-update.component.html',
})
export class LongTermTargetUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  strategicPlans?: StrategicPlan[] = [];
  objectives?: Objective[] = [];
  sections?: Section[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    strategic_plan_id: [null, [Validators.required]],
    objective_id: [null, [Validators.required]],
    code: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
  });

  constructor(
    protected longTermTargetService: LongTermTargetService,
    protected strategicPlanService: StrategicPlanService,
    protected objectiveService: ObjectiveService,
    protected sectionService: SectionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const dialogData = this.dialogConfig.data;
    this.sections = dialogData.sections;
    this.objectives = dialogData.objectives;
    this.updateForm(dialogData.target); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create LongTermTarget Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    const longTermTarget = this.createFromForm();
    console.log(longTermTarget);
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    if (longTermTarget.id !== undefined) {
      this.subscribeToSaveResponse(
        this.longTermTargetService.update(longTermTarget)
      );
    } else {
      this.subscribeToSaveResponse(
        this.longTermTargetService.create(longTermTarget)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<LongTermTarget>>
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
   * @param longTermTarget
   */
  protected updateForm(longTermTarget: LongTermTarget): void {
    this.editForm.patchValue({
      id: longTermTarget.id,
      description: longTermTarget.description,
      strategic_plan_id: longTermTarget.strategic_plan_id,
      objective_id: longTermTarget.objective_id,
      code: longTermTarget.code,
      section_id: longTermTarget.section_id,
    });
  }

  /**
   * Return form values as object of type LongTermTarget
   * @returns LongTermTarget
   */
  protected createFromForm(): LongTermTarget {
    return {
      ...new LongTermTarget(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      strategic_plan_id: this.editForm.get(['strategic_plan_id'])!.value,
      objective_id: this.editForm.get(['objective_id'])!.value,
      code: this.editForm.get(['code'])!.value,
      section_id: this.editForm.get(['section_id'])!.value,
    };
  }
}
