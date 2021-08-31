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
import { CasAssessmentCriteria } from '../cas-assessment-criteria.model';
import { CasAssessmentCriteriaService } from '../cas-assessment-criteria.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-cas-assessment-criteria-update',
  templateUrl: './cas-assessment-criteria-update.component.html',
})
export class CasAssessmentCriteriaUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  casAssessmentCategoryVersions?: CasAssessmentCategoryVersion[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    cas_assessment_category_version_id: [null, [Validators.required]],
    name: [null, [Validators.required, Validators.maxLength(200)]],
    number: [null, [Validators.required, Validators.min(0)]],
    how_to_assess: [null, [Validators.required, Validators.maxLength(200)]],
    how_to_score: [null, [Validators.required, Validators.maxLength(200)]],
  });

  constructor(
    protected casAssessmentCriteriaService: CasAssessmentCriteriaService,
    protected casAssessmentCategoryVersionService: CasAssessmentCategoryVersionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casAssessmentCategoryVersionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentCategoryVersion[]>) =>
          (this.casAssessmentCategoryVersions = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasAssessmentCriteria Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casAssessmentCriteria = this.createFromForm();
    if (casAssessmentCriteria.id !== undefined) {
      this.subscribeToSaveResponse(
        this.casAssessmentCriteriaService.update(casAssessmentCriteria)
      );
    } else {
      this.subscribeToSaveResponse(
        this.casAssessmentCriteriaService.create(casAssessmentCriteria)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasAssessmentCriteria>>
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
   * @param casAssessmentCriteria
   */
  protected updateForm(casAssessmentCriteria: CasAssessmentCriteria): void {
    this.editForm.patchValue({
      id: casAssessmentCriteria.id,
      cas_assessment_category_version_id:
        casAssessmentCriteria.cas_assessment_category_version_id,
      name: casAssessmentCriteria.name,
      number: casAssessmentCriteria.number,
      how_to_assess: casAssessmentCriteria.how_to_assess,
      how_to_score: casAssessmentCriteria.how_to_score,
    });
  }

  /**
   * Return form values as object of type CasAssessmentCriteria
   * @returns CasAssessmentCriteria
   */
  protected createFromForm(): CasAssessmentCriteria {
    return {
      ...new CasAssessmentCriteria(),
      id: this.editForm.get(['id'])!.value,
      cas_assessment_category_version_id: this.editForm.get([
        'cas_assessment_category_version_id',
      ])!.value,
      name: this.editForm.get(['name'])!.value,
      number: this.editForm.get(['number'])!.value,
      how_to_assess: this.editForm.get(['how_to_assess'])!.value,
      how_to_score: this.editForm.get(['how_to_score'])!.value,
    };
  }
}
