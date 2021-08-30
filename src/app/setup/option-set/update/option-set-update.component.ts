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
import { EnumService, PlanrepEnum } from 'src/app/shared/enum.service';
import { OptionSet } from '../option-set.model';
import { OptionSetService } from '../option-set.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-option-set-update',
  templateUrl: './option-set-update.component.html',
})
export class OptionSetUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  valueTypes?: PlanrepEnum[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    value_type: [null, [Validators.required]],
    version: [null, [Validators.required]],
  });

  constructor(
    protected optionSetService: OptionSetService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.valueTypes = this.enumService.get('valueTypes');
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create OptionSet Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const optionSet = this.createFromForm();
    if (optionSet.id !== undefined) {
      this.subscribeToSaveResponse(this.optionSetService.update(optionSet));
    } else {
      this.subscribeToSaveResponse(this.optionSetService.create(optionSet));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<OptionSet>>
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
   * @param optionSet
   */
  protected updateForm(optionSet: OptionSet): void {
    this.editForm.patchValue({
      id: optionSet.id,
      name: optionSet.name,
      code: optionSet.code,
      value_type: optionSet.value_type,
      version: optionSet.version,
    });
  }

  /**
   * Return form values as object of type OptionSet
   * @returns OptionSet
   */
  protected createFromForm(): OptionSet {
    return {
      ...new OptionSet(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      value_type: this.editForm.get(['value_type'])!.value,
      version: this.editForm.get(['version'])!.value,
    };
  }
}
