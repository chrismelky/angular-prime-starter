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
import { DataElementGroupSet } from '../data-element-group-set.model';
import { DataElementGroupSetService } from '../data-element-group-set.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-data-element-group-set-update',
  templateUrl: './data-element-group-set-update.component.html',
})
export class DataElementGroupSetUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, []],
  });

  constructor(
    protected dataElementGroupSetService: DataElementGroupSetService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create DataElementGroupSet or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const dataElementGroupSet = this.createFromForm();
    if (dataElementGroupSet.id !== undefined) {
      this.subscribeToSaveResponse(
        this.dataElementGroupSetService.update(dataElementGroupSet)
      );
    } else {
      this.subscribeToSaveResponse(
        this.dataElementGroupSetService.create(dataElementGroupSet)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<DataElementGroupSet>>
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
   * @param dataElementGroupSet
   */
  protected updateForm(dataElementGroupSet: DataElementGroupSet): void {
    this.editForm.patchValue({
      id: dataElementGroupSet.id,
      name: dataElementGroupSet.name,
      code: dataElementGroupSet.code,
    });
  }

  /**
   * Return form values as object of type DataElementGroupSet
   * @returns DataElementGroupSet
   */
  protected createFromForm(): DataElementGroupSet {
    return {
      ...new DataElementGroupSet(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
    };
  }
}
