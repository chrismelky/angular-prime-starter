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
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { PeSubForm } from 'src/app/setup/pe-sub-form/pe-sub-form.model';
import { PeSubFormService } from 'src/app/setup/pe-sub-form/pe-sub-form.service';
import { BudgetClass } from 'src/app/setup/budget-class/budget-class.model';
import { BudgetClassService } from 'src/app/setup/budget-class/budget-class.service';
import { FundSource } from 'src/app/setup/fund-source/fund-source.model';
import { FundSourceService } from 'src/app/setup/fund-source/fund-source.service';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { PeItem } from '../pe-item.model';
import { PeItemService } from '../pe-item.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-pe-item-update',
  templateUrl: './pe-item-update.component.html',
})
export class PeItemUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  peSubForms?: PeSubForm[] = [];
  budgetClasses?: BudgetClass[] = [];
  fundSources?: FundSource[] = [];
  sections?: Section[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    admin_hierarchy_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    pe_sub_form_id: [null, [Validators.required]],
    budget_class_id: [null, [Validators.required]],
    fund_source_id: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
  });

  constructor(
    protected peItemService: PeItemService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected peSubFormService: PeSubFormService,
    protected budgetClassService: BudgetClassService,
    protected fundSourceService: FundSourceService,
    protected sectionService: SectionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.peSubFormService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<PeSubForm[]>) => (this.peSubForms = resp.data)
      );
    this.budgetClassService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<BudgetClass[]>) =>
          (this.budgetClasses = resp.data)
      );
    this.fundSourceService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data)
      );
    // this.sectionService
    //   .query({ columns: ["id", "name"] })
    //   .subscribe(
    //     (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
    //   );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create PeItem or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    // if (this.editForm.invalid) {
    //   this.formError = true;
    //   return;
    // }
    // this.isSaving = true;
    // const peItem = this.createFromForm();
    // if (peItem.id !== undefined) {
    //   this.subscribeToSaveResponse(this.peItemService.update(peItem));
    // } else {
    //   this.subscribeToSaveResponse(this.peItemService.create(peItem));
    // }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<PeItem>>
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
   * @param peItem
   */
  protected updateForm(peItem: PeItem): void {
    this.editForm.patchValue({
      admin_hierarchy_id: peItem.admin_hierarchy_id,
      financial_year_id: peItem.financial_year_id,
      pe_sub_form_id: peItem.pe_sub_form_id,
      budget_class_id: peItem.budget_class_id,
      fund_source_id: peItem.fund_source_id,
      section_id: peItem.section_id,
    });
  }

  /**
   * Return form values as object of type PeItem
   * @returns PeItem
   */
  protected createFromForm(): PeItem {
    return {
      ...new PeItem(),
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
      financial_year_id: this.editForm.get(['financial_year_id'])!.value,
      pe_sub_form_id: this.editForm.get(['pe_sub_form_id'])!.value,
      budget_class_id: this.editForm.get(['budget_class_id'])!.value,
      fund_source_id: this.editForm.get(['fund_source_id'])!.value,
      section_id: this.editForm.get(['section_id'])!.value,
    };
  }
}
