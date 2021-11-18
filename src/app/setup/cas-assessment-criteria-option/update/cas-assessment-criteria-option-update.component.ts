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
import { CasAssessmentCategoryVersion } from 'src/app/setup/cas-assessment-category-version/cas-assessment-category-version.model';
import { CasAssessmentCategoryVersionService } from 'src/app/setup/cas-assessment-category-version/cas-assessment-category-version.service';
import { CasPlanContent } from 'src/app/setup/cas-plan-content/cas-plan-content.model';
import { CasPlanContentService } from 'src/app/setup/cas-plan-content/cas-plan-content.service';
import { CasAssessmentCriteriaOption } from '../cas-assessment-criteria-option.model';
import { CasAssessmentCriteriaOptionService } from '../cas-assessment-criteria-option.service';
import { ToastService } from 'src/app/shared/toast.service';
import { CasPlanService } from '../../cas-plan/cas-plan.service';
import { CasPlan } from '../../cas-plan/cas-plan.model';

@Component({
  selector: 'app-cas-assessment-criteria-option-update',
  templateUrl: './cas-assessment-criteria-option-update.component.html',
})
export class CasAssessmentCriteriaOptionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  casAssessmentCategoryVersions?: CasAssessmentCategoryVersion[] = [];
  casPlanContents?: CasPlanContent[] = [];
  casPlans?: CasPlan[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    number: [null, [Validators.required]],
    cas_plan_id: [null, [Validators.required]],
  });

  constructor(
    protected casAssessmentCriteriaOptionService: CasAssessmentCriteriaOptionService,
    protected casAssessmentCategoryVersionService: CasAssessmentCategoryVersionService,
    protected casPlanContentService: CasPlanContentService,
    protected casPlanService: CasPlanService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casPlanService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasPlan[]>) => (this.casPlans = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasAssessmentCriteriaOption or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casAssessmentCriteriaOption = this.createFromForm();
    if (casAssessmentCriteriaOption.id !== undefined) {
      this.subscribeToSaveResponse(
        this.casAssessmentCriteriaOptionService.update(
          casAssessmentCriteriaOption
        )
      );
    } else {
      this.subscribeToSaveResponse(
        this.casAssessmentCriteriaOptionService.create(
          casAssessmentCriteriaOption
        )
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasAssessmentCriteriaOption>>
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
   * @param casAssessmentCriteriaOption
   */
  protected updateForm(
    casAssessmentCriteriaOption: CasAssessmentCriteriaOption
  ): void {
    this.editForm.patchValue({
      id: casAssessmentCriteriaOption.id,
      name: casAssessmentCriteriaOption.name,
      number: casAssessmentCriteriaOption.number,
      cas_plan_id: casAssessmentCriteriaOption.cas_plan_id,
    });
  }

  /**
   * Return form values as object of type CasAssessmentCriteriaOption
   * @returns CasAssessmentCriteriaOption
   */
  protected createFromForm(): CasAssessmentCriteriaOption {
    return {
      ...new CasAssessmentCriteriaOption(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      number: this.editForm.get(['number'])!.value,
      cas_plan_id: this.editForm.get(['cas_plan_id'])!.value,
    };
  }
}
