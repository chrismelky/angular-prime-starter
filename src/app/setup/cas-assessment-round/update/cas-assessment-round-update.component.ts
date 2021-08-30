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
import { CasAssessmentRound } from '../cas-assessment-round.model';
import { CasAssessmentRoundService } from '../cas-assessment-round.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-cas-assessment-round-update',
  templateUrl: './cas-assessment-round-update.component.html',
})
export class CasAssessmentRoundUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    number: [null, [Validators.required]],
  });

  constructor(
    protected casAssessmentRoundService: CasAssessmentRoundService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasAssessmentRound Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casAssessmentRound = this.createFromForm();
    if (casAssessmentRound.id !== undefined) {
      this.subscribeToSaveResponse(
        this.casAssessmentRoundService.update(casAssessmentRound)
      );
    } else {
      this.subscribeToSaveResponse(
        this.casAssessmentRoundService.create(casAssessmentRound)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasAssessmentRound>>
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
   * @param casAssessmentRound
   */
  protected updateForm(casAssessmentRound: CasAssessmentRound): void {
    this.editForm.patchValue({
      id: casAssessmentRound.id,
      name: casAssessmentRound.name,
      number: casAssessmentRound.number,
    });
  }

  /**
   * Return form values as object of type CasAssessmentRound
   * @returns CasAssessmentRound
   */
  protected createFromForm(): CasAssessmentRound {
    return {
      ...new CasAssessmentRound(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      number: this.editForm.get(['number'])!.value,
    };
  }
}
