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
import { ReferenceDocument } from 'src/app/setup/reference-document/reference-document.model';
import { ReferenceDocumentService } from 'src/app/setup/reference-document/reference-document.service';
import { PlanningMatrix } from '../planning-matrix.model';
import { PlanningMatrixService } from '../planning-matrix.service';
import { ToastService } from 'src/app/shared/toast.service';
import { NationalReferenceService } from '../../national-reference/national-reference.service';

@Component({
  selector: 'app-planning-matrix-update',
  templateUrl: './planning-matrix-update.component.html',
})
export class PlanningMatrixUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  referenceDocuments?: ReferenceDocument[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    reference_document_id: [null, [Validators.required]],
  });

  constructor(
    protected planningMatrixService: PlanningMatrixService,
    protected referenceDocumentService: ReferenceDocumentService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.referenceDocumentService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<ReferenceDocument[]>) =>
          (this.referenceDocuments = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create PlanningMatrix or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const planningMatrix = this.createFromForm();
    if (planningMatrix.id !== undefined) {
      this.subscribeToSaveResponse(
        this.planningMatrixService.update(planningMatrix)
      );
    } else {
      this.subscribeToSaveResponse(
        this.planningMatrixService.create(planningMatrix)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<PlanningMatrix>>
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
   * @param planningMatrix
   */
  protected updateForm(planningMatrix: PlanningMatrix): void {
    this.editForm.patchValue({
      id: planningMatrix.id,
      name: planningMatrix.name,
      reference_document_id: planningMatrix.reference_document_id,
    });
  }

  /**
   * Return form values as object of type PlanningMatrix
   * @returns PlanningMatrix
   */
  protected createFromForm(): PlanningMatrix {
    return {
      ...new PlanningMatrix(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      reference_document_id: this.editForm.get(['reference_document_id'])!
        .value,
    };
  }
}
