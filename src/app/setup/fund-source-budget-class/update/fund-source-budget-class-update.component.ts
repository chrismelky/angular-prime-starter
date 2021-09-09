/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { CustomResponse } from "../../../utils/custom-response";
import { BudgetClass } from "src/app/setup/budget-class/budget-class.model";
import { BudgetClassService } from "src/app/setup/budget-class/budget-class.service";
import { FundSource } from "src/app/setup/fund-source/fund-source.model";
import { FundSourceService } from "src/app/setup/fund-source/fund-source.service";
import { FundType } from "src/app/setup/fund-type/fund-type.model";
import { FundTypeService } from "src/app/setup/fund-type/fund-type.service";
import { BankAccount } from "src/app/setup/bank-account/bank-account.model";
import { BankAccountService } from "src/app/setup/bank-account/bank-account.service";
import { FundSourceBudgetClass } from "../fund-source-budget-class.model";
import { FundSourceBudgetClassService } from "../fund-source-budget-class.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-fund-source-budget-class-update",
  templateUrl: "./fund-source-budget-class-update.component.html",
})
export class FundSourceBudgetClassUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  budgetClasses?: BudgetClass[] = [];
  fundSources?: FundSource[] = [];
  fundTypes?: FundType[] = [];
  bankAccounts?: BankAccount[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    ceiling_name: [null, [Validators.required]],
    budget_class_id: [null, [Validators.required]],
    fund_source_id: [null, [Validators.required]],
    fund_type_id: [null, [Validators.required]],
    bank_account_id: [null, [Validators.required]],
  });

  constructor(
    protected fundSourceBudgetClassService: FundSourceBudgetClassService,
    protected budgetClassService: BudgetClassService,
    protected fundSourceService: FundSourceService,
    protected fundTypeService: FundTypeService,
    protected bankAccountService: BankAccountService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.budgetClassService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<BudgetClass[]>) =>
          (this.budgetClasses = resp.data)
      );
    this.fundSourceService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data)
      );
    this.fundTypeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundType[]>) => (this.fundTypes = resp.data)
      );
    this.bankAccountService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<BankAccount[]>) => (this.bankAccounts = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create FundSourceBudgetClass or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const fundSourceBudgetClass = this.createFromForm();
    if (fundSourceBudgetClass.id !== undefined) {
      this.subscribeToSaveResponse(
        this.fundSourceBudgetClassService.update(fundSourceBudgetClass)
      );
    } else {
      this.subscribeToSaveResponse(
        this.fundSourceBudgetClassService.create(fundSourceBudgetClass)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FundSourceBudgetClass>>
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
   * @param fundSourceBudgetClass
   */
  protected updateForm(fundSourceBudgetClass: FundSourceBudgetClass): void {
    this.editForm.patchValue({
      id: fundSourceBudgetClass.id,
      ceiling_name: fundSourceBudgetClass.ceiling_name,
      budget_class_id: fundSourceBudgetClass.budget_class_id,
      fund_source_id: fundSourceBudgetClass.fund_source_id,
      fund_type_id: fundSourceBudgetClass.fund_type_id,
      bank_account_id: fundSourceBudgetClass.bank_account_id,
    });
  }

  /**
   * Return form values as object of type FundSourceBudgetClass
   * @returns FundSourceBudgetClass
   */
  protected createFromForm(): FundSourceBudgetClass {
    return {
      ...new FundSourceBudgetClass(),
      id: this.editForm.get(["id"])!.value,
      ceiling_name: this.editForm.get(["ceiling_name"])!.value,
      budget_class_id: this.editForm.get(["budget_class_id"])!.value,
      fund_source_id: this.editForm.get(["fund_source_id"])!.value,
      fund_type_id: this.editForm.get(["fund_type_id"])!.value,
      bank_account_id: this.editForm.get(["bank_account_id"])!.value,
    };
  }
}
