/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { StrategicPlan } from '../strategic-plan.model';
import { StrategicPlanService } from '../strategic-plan.service';
import { ToastService } from 'src/app/shared/toast.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.model';

@Component({
  selector: 'app-strategic-plan-update',
  templateUrl: './strategic-plan-update.component.html',
})
export class StrategicPlanUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  uploadedFiles = [];

  adminHierarchies?: AdminHierarchy[] = [];
  startFinancialYears?: FinancialYear[] = [];
  endFinancialYears?: FinancialYear[] = [];
  currentUser?: User;

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    admin_hierarchy_id: [null, [Validators.required]],
    start_financial_year_id: [null, [Validators.required]],
    end_financial_year_id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    description: [null, []],
    is_active: [false, []],
    url: [null, []],
    file: [null, []],
  });

  constructor(
    protected strategicPlanService: StrategicPlanService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected userService: UserService
  ) {
    this.currentUser = userService.getCurrentUser();
    if (this.currentUser.admin_hierarchy) {
      this.adminHierarchies?.push(this.currentUser.admin_hierarchy);
      // @ts-ignore
      this.admin_hierarchy_id = this.adminHierarchies[0].id!;
    }
  }

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.startFinancialYears = resp.data)
      );
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.endFinancialYears = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create StrategicPlan Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const strategicPlan = this.createFromForm();
    if (strategicPlan.get('id') !== 'undefined') {
      this.subscribeToSaveResponse(
        this.strategicPlanService.update(strategicPlan)
      );
    } else {
      this.subscribeToSaveResponse(
        this.strategicPlanService.create(strategicPlan)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<StrategicPlan>>
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
   * @param strategicPlan
   */
  protected updateForm(strategicPlan: StrategicPlan): void {
    this.editForm.patchValue({
      id: strategicPlan.id,
      admin_hierarchy_id: strategicPlan.admin_hierarchy_id,
      start_financial_year_id: strategicPlan.start_financial_year_id,
      end_financial_year_id: strategicPlan.end_financial_year_id,
      name: strategicPlan.name,
      description: strategicPlan.description,
      is_active: strategicPlan.is_active,
      url: strategicPlan.url,
    });
  }

  /**
   * Return form values as object of type StrategicPlan
   * @returns StrategicPlan
   */
  protected createFromForm(): FormData {
    const fd = new FormData();
    fd.append('id', this.editForm.get(['id'])!.value);
    fd.append(
      'admin_hierarchy_id',
      this.editForm.get(['admin_hierarchy_id'])!.value
    );
    fd.append(
      'start_financial_year_id',
      this.editForm.get(['start_financial_year_id'])!.value
    );
    fd.append(
      'end_financial_year_id',
      this.editForm.get(['end_financial_year_id'])!.value
    );
    fd.append('name', this.editForm.get(['name'])!.value);
    fd.append('description', this.editForm.get(['description'])!.value);
    fd.append('is_active', this.editForm.get(['is_active'])!.value);
    fd.append('url', this.editForm.get(['url'])!.value);
    fd.append('file', this.editForm.get(['file'])!.value);
    return fd;
  }

  onSelect(event: any) {
    // @ts-ignore
    if (event.files?.length)
      this.editForm.patchValue({
        file: event.files[0],
      });
  }

  downloadStrategicPlan() {
    this.strategicPlanService
      .download(this.editForm.get('id')?.value)
      .subscribe((resp) => {
        let file = new Blob([resp], { type: 'application/pdf' });
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      });
  }
}
