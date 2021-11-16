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
import { ProcurementMethod } from '../procurement-method.model';
import { ProcurementMethodService } from '../procurement-method.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-procurement-method-update',
  templateUrl: './procurement-method-update.component.html',
})
export class ProcurementMethodUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    code: [null, [Validators.required]],
    name: [null, [Validators.required]],
  });

  constructor(
    protected procurementMethodService: ProcurementMethodService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ProcurementMethod or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const procurementMethod = this.createFromForm();
    if (procurementMethod.id !== undefined) {
      this.subscribeToSaveResponse(
        this.procurementMethodService.update(procurementMethod)
      );
    } else {
      this.subscribeToSaveResponse(
        this.procurementMethodService.create(procurementMethod)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProcurementMethod>>
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
   * @param procurementMethod
   */
  protected updateForm(procurementMethod: ProcurementMethod): void {
    this.editForm.patchValue({
      id: procurementMethod.id,
      code: procurementMethod.code,
      name: procurementMethod.name,
    });
  }

  /**
   * Return form values as object of type ProcurementMethod
   * @returns ProcurementMethod
   */
  protected createFromForm(): ProcurementMethod {
    return {
      ...new ProcurementMethod(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
