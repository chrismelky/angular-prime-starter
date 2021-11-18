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
import { BudgetClass } from '../budget-class.model';
import { BudgetClassService } from '../budget-class.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-budget-class-update',
  templateUrl: './budget-class-update.component.html',
})
export class BudgetClassUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  parents?: BudgetClass[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, []],
    parent_id: [null, []],
  });

  constructor(
    protected budgetClassService: BudgetClassService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.budgetClassService
      .query({ columns: ['id', 'name', 'code'] })
      .subscribe(
        (resp: CustomResponse<BudgetClass[]>) => (this.parents = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create BudgetClass or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const budgetClass = this.createFromForm();
    if (budgetClass.id !== undefined) {
      this.subscribeToSaveResponse(this.budgetClassService.update(budgetClass));
    } else {
      this.subscribeToSaveResponse(this.budgetClassService.create(budgetClass));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<BudgetClass>>
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
   * @param budgetClass
   */
  protected updateForm(budgetClass: BudgetClass): void {
    this.editForm.patchValue({
      id: budgetClass.id,
      name: budgetClass.name,
      code: budgetClass.code,
      parent_id: budgetClass.parent_id,
    });
  }

  /**
   * Return form values as object of type BudgetClass
   * @returns BudgetClass
   */
  protected createFromForm(): BudgetClass {
    return {
      ...new BudgetClass(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      parent_id: this.editForm.get(['parent_id'])!.value,
    };
  }
}
