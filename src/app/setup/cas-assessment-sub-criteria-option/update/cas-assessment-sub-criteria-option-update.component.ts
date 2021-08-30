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
import { CasAssessmentCriteriaOption } from 'src/app/setup/cas-assessment-criteria-option/cas-assessment-criteria-option.model';
import { CasAssessmentCriteriaOptionService } from 'src/app/setup/cas-assessment-criteria-option/cas-assessment-criteria-option.service';
import { CasAssessmentSubCriteriaOption } from '../cas-assessment-sub-criteria-option.model';
import { CasAssessmentSubCriteriaOptionService } from '../cas-assessment-sub-criteria-option.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-cas-assessment-sub-criteria-option-update',
  templateUrl: './cas-assessment-sub-criteria-option-update.component.html',
})
export class CasAssessmentSubCriteriaOptionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  casAssessmentCriteriaOptions?: CasAssessmentCriteriaOption[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    serial_number: [null, [Validators.required]],
    cas_assessment_criteria_option_id: [null, [Validators.required]],
    score_value: [null, []],
    is_free_score: [false, []],
  });

  constructor(
    protected casAssessmentSubCriteriaOptionService: CasAssessmentSubCriteriaOptionService,
    protected casAssessmentCriteriaOptionService: CasAssessmentCriteriaOptionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casAssessmentCriteriaOptionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentCriteriaOption[]>) =>
          (this.casAssessmentCriteriaOptions = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasAssessmentSubCriteriaOption Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casAssessmentSubCriteriaOption = this.createFromForm();
    if (casAssessmentSubCriteriaOption.id !== undefined) {
      this.subscribeToSaveResponse(
        this.casAssessmentSubCriteriaOptionService.update(
          casAssessmentSubCriteriaOption
        )
      );
    } else {
      this.subscribeToSaveResponse(
        this.casAssessmentSubCriteriaOptionService.create(
          casAssessmentSubCriteriaOption
        )
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasAssessmentSubCriteriaOption>>
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
   * @param casAssessmentSubCriteriaOption
   */
  protected updateForm(
    casAssessmentSubCriteriaOption: CasAssessmentSubCriteriaOption
  ): void {
    this.editForm.patchValue({
      id: casAssessmentSubCriteriaOption.id,
      name: casAssessmentSubCriteriaOption.name,
      serial_number: casAssessmentSubCriteriaOption.serial_number,
      cas_assessment_criteria_option_id:
        casAssessmentSubCriteriaOption.cas_assessment_criteria_option_id,
      score_value: casAssessmentSubCriteriaOption.score_value,
      is_free_score: casAssessmentSubCriteriaOption.is_free_score,
    });
  }

  /**
   * Return form values as object of type CasAssessmentSubCriteriaOption
   * @returns CasAssessmentSubCriteriaOption
   */
  protected createFromForm(): CasAssessmentSubCriteriaOption {
    return {
      ...new CasAssessmentSubCriteriaOption(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      serial_number: this.editForm.get(['serial_number'])!.value,
      cas_assessment_criteria_option_id: this.editForm.get([
        'cas_assessment_criteria_option_id',
      ])!.value,
      score_value: this.editForm.get(['score_value'])!.value,
      is_free_score: this.editForm.get(['is_free_score'])!.value,
    };
  }
}
