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
import { PeForm } from '../pe-form.model';
import { PeFormService } from '../pe-form.service';
import { ToastService } from 'src/app/shared/toast.service';
import { BudgetClassService } from '../../budget-class/budget-class.service';
import { SelectItemGroup } from 'primeng/api';
import { FundSourceService } from '../../fund-source/fund-source.service';

@Component({
  selector: 'app-pe-form-update',
  templateUrl: './pe-form-update.component.html',
})
export class PeFormUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  fundSources?: any[] = [];
  budgetClasses?: SelectItemGroup[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    description: [null, [Validators.required]],
    budget_classes: [null, []],
    fund_sources: [null, []],
    is_active: [false, [Validators.required]],
  });

  constructor(
    protected peFormService: PeFormService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private budgetClassService: BudgetClassService,
    private fundSourceService: FundSourceService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog

    this.budgetClassService
      .getParentChild()
      .subscribe(
        (resp: CustomResponse<any[]>) => (this.budgetClasses = resp.data)
      );

    this.fundSourceService
      .getPeFundSource()
      .subscribe((resp: CustomResponse<any[]>) => {
        this.fundSources = resp.data;
      });
  }

  /**
   * When form is valid Create PeForm or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const peForm = this.createFromForm();
    if (peForm.id !== undefined) {
      this.subscribeToSaveResponse(this.peFormService.update(peForm));
    } else {
      this.subscribeToSaveResponse(this.peFormService.create(peForm));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<PeForm>>
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
   * @param peForm
   */
  protected updateForm(peForm: PeForm): void {
    this.editForm.patchValue({
      id: peForm.id,
      name: peForm.name,
      description: peForm.description,
      budget_classes: peForm.budget_classes,
      fund_sources: peForm.fund_sources,
      is_active: peForm.is_active,
    });
  }

  /**
   * Return form values as object of type PeForm
   * @returns PeForm
   */
  protected createFromForm(): PeForm {
    return {
      ...new PeForm(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      budget_classes: this.editForm.get(['budget_classes'])!.value,
      fund_sources: this.editForm.get(['fund_sources'])!.value,
      is_active: this.editForm.get(['is_active'])!.value,
    };
  }
}
