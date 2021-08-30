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
import { CasAssessmentCriteria } from 'src/app/setup/cas-assessment-criteria/cas-assessment-criteria.model';
import { CasAssessmentCriteriaService } from 'src/app/setup/cas-assessment-criteria/cas-assessment-criteria.service';
import { CasAssessmentSubCriteria } from '../cas-assessment-sub-criteria.model';
import { CasAssessmentSubCriteriaService } from '../cas-assessment-sub-criteria.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-cas-assessment-sub-criteria-update',
  templateUrl: './cas-assessment-sub-criteria-update.component.html',
})
export class CasAssessmentSubCriteriaUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  casAssessmentCriteria?: CasAssessmentCriteria[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    serial_number: [null, [Validators.required]],
    how_to_assess: [null, [Validators.required]],
    how_to_score: [null, [Validators.required]],
    cas_assessment_criteria_id: [null, [Validators.required]],
    score_value: [null, [Validators.required]],
    is_free_score: [false, [Validators.required]],
  });

  constructor(
    protected casAssessmentSubCriteriaService: CasAssessmentSubCriteriaService,
    protected casAssessmentCriteriaService: CasAssessmentCriteriaService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casAssessmentCriteriaService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentCriteria[]>) =>
          (this.casAssessmentCriteria = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasAssessmentSubCriteria Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casAssessmentSubCriteria = this.createFromForm();
    if (casAssessmentSubCriteria.id !== undefined) {
      this.subscribeToSaveResponse(
        this.casAssessmentSubCriteriaService.update(casAssessmentSubCriteria)
      );
    } else {
      this.subscribeToSaveResponse(
        this.casAssessmentSubCriteriaService.create(casAssessmentSubCriteria)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasAssessmentSubCriteria>>
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
   * @param casAssessmentSubCriteria
   */
  protected updateForm(
    casAssessmentSubCriteria: CasAssessmentSubCriteria
  ): void {
    this.editForm.patchValue({
      id: casAssessmentSubCriteria.id,
      name: casAssessmentSubCriteria.name,
      serial_number: casAssessmentSubCriteria.serial_number,
      how_to_assess: casAssessmentSubCriteria.how_to_assess,
      how_to_score: casAssessmentSubCriteria.how_to_score,
      cas_assessment_criteria_id:
        casAssessmentSubCriteria.cas_assessment_criteria_id,
      score_value: casAssessmentSubCriteria.score_value,
      is_free_score: casAssessmentSubCriteria.is_free_score,
    });
  }

  /**
   * Return form values as object of type CasAssessmentSubCriteria
   * @returns CasAssessmentSubCriteria
   */
  protected createFromForm(): CasAssessmentSubCriteria {
    return {
      ...new CasAssessmentSubCriteria(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      serial_number: this.editForm.get(['serial_number'])!.value,
      how_to_assess: this.editForm.get(['how_to_assess'])!.value,
      how_to_score: this.editForm.get(['how_to_score'])!.value,
      cas_assessment_criteria_id: this.editForm.get([
        'cas_assessment_criteria_id',
      ])!.value,
      score_value: this.editForm.get(['score_value'])!.value,
      is_free_score: this.editForm.get(['is_free_score'])!.value,
    };
  }
}
