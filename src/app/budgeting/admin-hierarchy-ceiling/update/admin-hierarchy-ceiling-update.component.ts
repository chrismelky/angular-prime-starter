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
import { FundSourceBudgetClass } from 'src/app/setup/fund-source-budget-class/fund-source-budget-class.model';
import { FundSourceBudgetClassService } from 'src/app/setup/fund-source-budget-class/fund-source-budget-class.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { AdminHierarchyCeiling } from '../admin-hierarchy-ceiling.model';
import { AdminHierarchyCeilingService } from '../admin-hierarchy-ceiling.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-admin-hierarchy-ceiling-update',
  templateUrl: './admin-hierarchy-ceiling-update.component.html',
})
export class AdminHierarchyCeilingUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  ceilings?: FundSourceBudgetClass[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  parents?: AdminHierarchyCeiling[] = [];
  sections?: Section[] = [];
  budgetTypes?: PlanrepEnum[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    ceiling_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    parent_id: [null, []],
    section_id: [null, [Validators.required]],
    active: [false, []],
    is_locked: [false, []],
    is_approved: [false, []],
    budget_type: [null, [Validators.required]],
    amount: [null, []],
    deleted: [false, []],
  });

  constructor(
    protected adminHierarchyCeilingService: AdminHierarchyCeilingService,
    protected ceilingService: FundSourceBudgetClassService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected parentService: AdminHierarchyCeilingService,
    protected sectionService: SectionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.ceilingService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FundSourceBudgetClass[]>) =>
          (this.ceilings = resp.data)
      );
    this.parentService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchyCeiling[]>) =>
          (this.parents = resp.data)
      );
    this.sectionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    this.budgetTypes = this.enumService.get('budgetTypes');
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create AdminHierarchyCeiling or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const adminHierarchyCeiling = this.createFromForm();
    if (adminHierarchyCeiling.id !== undefined) {
      this.subscribeToSaveResponse(
        this.adminHierarchyCeilingService.update(adminHierarchyCeiling)
      );
    } else {
      this.subscribeToSaveResponse(
        this.adminHierarchyCeilingService.create(adminHierarchyCeiling)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<AdminHierarchyCeiling>>
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
   * @param adminHierarchyCeiling
   */
  protected updateForm(adminHierarchyCeiling: AdminHierarchyCeiling): void {
    this.editForm.patchValue({
      id: adminHierarchyCeiling.id,
      ceiling_id: adminHierarchyCeiling.ceiling_id,
      admin_hierarchy_id: adminHierarchyCeiling.admin_hierarchy_id,
      financial_year_id: adminHierarchyCeiling.financial_year_id,
      parent_id: adminHierarchyCeiling.parent_id,
      section_id: adminHierarchyCeiling.section_id,
      active: adminHierarchyCeiling.active,
      is_locked: adminHierarchyCeiling.is_locked,
      is_approved: adminHierarchyCeiling.is_approved,
      budget_type: adminHierarchyCeiling.budget_type,
      amount: adminHierarchyCeiling.amount,
      deleted: adminHierarchyCeiling.deleted,
    });
  }

  /**
   * Return form values as object of type AdminHierarchyCeiling
   * @returns AdminHierarchyCeiling
   */
  protected createFromForm(): AdminHierarchyCeiling {
    return {
      ...new AdminHierarchyCeiling(),
      id: this.editForm.get(['id'])!.value,
      ceiling_id: this.editForm.get(['ceiling_id'])!.value,
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
      financial_year_id: this.editForm.get(['financial_year_id'])!.value,
      parent_id: this.editForm.get(['parent_id'])!.value,
      section_id: this.editForm.get(['section_id'])!.value,
      active: this.editForm.get(['active'])!.value,
      is_locked: this.editForm.get(['is_locked'])!.value,
      is_approved: this.editForm.get(['is_approved'])!.value,
      budget_type: this.editForm.get(['budget_type'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      deleted: this.editForm.get(['deleted'])!.value,
    };
  }
}
