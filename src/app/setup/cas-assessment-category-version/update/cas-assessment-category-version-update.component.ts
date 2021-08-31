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
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { ReferenceDocument } from 'src/app/setup/reference-document/reference-document.model';
import { ReferenceDocumentService } from 'src/app/setup/reference-document/reference-document.service';
import { CasAssessmentState } from 'src/app/setup/cas-assessment-state/cas-assessment-state.model';
import { CasAssessmentStateService } from 'src/app/setup/cas-assessment-state/cas-assessment-state.service';
import { CasAssessmentCategory } from 'src/app/setup/cas-assessment-category/cas-assessment-category.model';
import { CasAssessmentCategoryService } from 'src/app/setup/cas-assessment-category/cas-assessment-category.service';
import { CasAssessmentCategoryVersion } from '../cas-assessment-category-version.model';
import { CasAssessmentCategoryVersionService } from '../cas-assessment-category-version.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-cas-assessment-category-version-update',
  templateUrl: './cas-assessment-category-version-update.component.html',
})
export class CasAssessmentCategoryVersionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  financialYears?: FinancialYear[] = [];
  referenceDocuments?: ReferenceDocument[] = [];
  casAssessmentStates?: CasAssessmentState[] = [];
  casAssessmentCategories?: CasAssessmentCategory[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    financial_year_id: [null, [Validators.required]],
    reference_document_id: [null, [Validators.required]],
    cas_assessment_state_id: [null, [Validators.required]],
    cas_assessment_category_id: [null, []],
    minimum_passmark: [null, [Validators.required]],
  });

  constructor(
    protected casAssessmentCategoryVersionService: CasAssessmentCategoryVersionService,
    protected financialYearService: FinancialYearService,
    protected referenceDocumentService: ReferenceDocumentService,
    protected casAssessmentStateService: CasAssessmentStateService,
    protected casAssessmentCategoryService: CasAssessmentCategoryService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.referenceDocumentService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<ReferenceDocument[]>) =>
          (this.referenceDocuments = resp.data)
      );
    this.casAssessmentStateService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentState[]>) =>
          (this.casAssessmentStates = resp.data)
      );
    this.casAssessmentCategoryService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentCategory[]>) =>
          (this.casAssessmentCategories = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasAssessmentCategoryVersion Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casAssessmentCategoryVersion = this.createFromForm();
    if (casAssessmentCategoryVersion.id !== undefined) {
      this.subscribeToSaveResponse(
        this.casAssessmentCategoryVersionService.update(
          casAssessmentCategoryVersion
        )
      );
    } else {
      this.subscribeToSaveResponse(
        this.casAssessmentCategoryVersionService.create(
          casAssessmentCategoryVersion
        )
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasAssessmentCategoryVersion>>
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
   * @param casAssessmentCategoryVersion
   */
  protected updateForm(
    casAssessmentCategoryVersion: CasAssessmentCategoryVersion
  ): void {
    this.editForm.patchValue({
      id: casAssessmentCategoryVersion.id,
      financial_year_id: casAssessmentCategoryVersion.financial_year_id,
      reference_document_id: casAssessmentCategoryVersion.reference_document_id,
      cas_assessment_state_id:
        casAssessmentCategoryVersion.cas_assessment_state_id,
      cas_assessment_category_id:
        casAssessmentCategoryVersion.cas_assessment_category_id,
      minimum_passmark: casAssessmentCategoryVersion.minimum_passmark,
    });
  }

  /**
   * Return form values as object of type CasAssessmentCategoryVersion
   * @returns CasAssessmentCategoryVersion
   */
  protected createFromForm(): CasAssessmentCategoryVersion {
    return {
      ...new CasAssessmentCategoryVersion(),
      id: this.editForm.get(['id'])!.value,
      financial_year_id: this.editForm.get(['financial_year_id'])!.value,
      reference_document_id: this.editForm.get(['reference_document_id'])!
        .value,
      cas_assessment_state_id: this.editForm.get(['cas_assessment_state_id'])!
        .value,
      cas_assessment_category_id: this.editForm.get([
        'cas_assessment_category_id',
      ])!.value,
      minimum_passmark: this.editForm.get(['minimum_passmark'])!.value,
    };
  }
}
