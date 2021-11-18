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
import { PeForm } from 'src/app/setup/pe-form/pe-form.model';
import { PeFormService } from 'src/app/setup/pe-form/pe-form.service';
import { PeSubForm } from '../pe-sub-form.model';
import { PeSubFormService } from '../pe-sub-form.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-pe-sub-form-update',
  templateUrl: './pe-sub-form-update.component.html',
})
export class PeSubFormUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  parents?: PeSubForm[] = [];
  peForms?: PeForm[] = [];
  sub_form_id: number = 0;

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    parent_id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    pe_form_id: [null, []],
    is_lowest: [false, []],
    sort_order: [null, []],
    is_multiple: [false, []],
    is_active: [false, []],
  });

  constructor(
    protected peSubFormService: PeSubFormService,
    protected parentService: PeSubFormService,
    protected peFormService: PeFormService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    console.log('PE');
    console.log(this.dialogConfig.data?.id);
    this.sub_form_id = this.dialogConfig.data?.id;
    this.parentService
      .query({ columns: ['id', 'name'], parent_id: null })
      .subscribe((resp: CustomResponse<PeSubForm[]>) => {
        this.parents = (resp.data ?? []).filter(
          (p) => p.id !== this.sub_form_id
        );
      });
    this.peFormService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<PeForm[]>) => (this.peForms = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create PeSubForm or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const peSubForm = this.createFromForm();
    if (peSubForm.id !== undefined) {
      this.subscribeToSaveResponse(this.peSubFormService.update(peSubForm));
    } else {
      this.subscribeToSaveResponse(this.peSubFormService.create(peSubForm));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<PeSubForm>>
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
   * @param peSubForm
   */
  protected updateForm(peSubForm: PeSubForm): void {
    this.editForm.patchValue({
      id: peSubForm.id,
      parent_id: peSubForm.parent_id,
      name: peSubForm.name,
      code: peSubForm.code,
      pe_form_id: peSubForm.pe_form_id,
      is_lowest: peSubForm.is_lowest,
      sort_order: peSubForm.sort_order,
      is_multiple: peSubForm.is_multiple,
      is_active: peSubForm.is_active,
    });
  }

  /**
   * Return form values as object of type PeSubForm
   * @returns PeSubForm
   */
  protected createFromForm(): PeSubForm {
    return {
      ...new PeSubForm(),
      id: this.editForm.get(['id'])!.value,
      parent_id: this.editForm.get(['parent_id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      pe_form_id: this.editForm.get(['pe_form_id'])!.value,
      is_lowest: this.editForm.get(['is_lowest'])!.value,
      sort_order: this.editForm.get(['sort_order'])!.value,
      is_multiple: this.editForm.get(['is_multiple'])!.value,
      is_active: this.editForm.get(['is_active'])!.value,
    };
  }
}
