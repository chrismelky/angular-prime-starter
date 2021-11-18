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
import { ProcurementType } from '../procurement-type.model';
import { ProcurementTypeService } from '../procurement-type.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-procurement-type-update',
  templateUrl: './procurement-type-update.component.html',
})
export class ProcurementTypeUpdateComponent implements OnInit {
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
    protected procurementTypeService: ProcurementTypeService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ProcurementType or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const procurementType = this.createFromForm();
    if (procurementType.id !== undefined) {
      this.subscribeToSaveResponse(
        this.procurementTypeService.update(procurementType)
      );
    } else {
      this.subscribeToSaveResponse(
        this.procurementTypeService.create(procurementType)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProcurementType>>
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
   * @param procurementType
   */
  protected updateForm(procurementType: ProcurementType): void {
    this.editForm.patchValue({
      id: procurementType.id,
      code: procurementType.code,
      name: procurementType.name,
    });
  }

  /**
   * Return form values as object of type ProcurementType
   * @returns ProcurementType
   */
  protected createFromForm(): ProcurementType {
    return {
      ...new ProcurementType(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
