import {Component, Input, OnInit} from '@angular/core';
import {CustomResponse} from "../../../utils/custom-response";
import {BankAccount} from "../../bank-account/bank-account.model";
import {BankAccountService} from "../../bank-account/bank-account.service";
import {FormBuilder, Validators} from "@angular/forms";
import {FundSourceBudgetClass} from "../fund-source-budget-class.model";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {ToastService} from "../../../shared/toast.service";
import {FundSourceBudgetClassService} from "../fund-source-budget-class.service";

@Component({
  selector: 'app-ceiling-bank-account-update',
  templateUrl: './ceiling-bank-account-update.component.html',
  styleUrls: ['./ceiling-bank-account-update.component.scss']
})
export class CeilingBankAccountUpdateComponent implements OnInit {
  @Input() ceiling?: any;
  bankAccounts?: BankAccount[] = [];
  bankAccountForm = this.fb.group({
    bank_account_id: [null,[Validators.required]],
  });
  constructor(
    protected bankAccountService: BankAccountService,
    protected fb: FormBuilder,
    protected toastService: ToastService,
    protected fundSourceBudgetClassService: FundSourceBudgetClassService,
  ) { }

  ngOnInit(): void {
    console.log(this.ceiling);
  }

  loadBankAccount(): void{
    this.bankAccountService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<BankAccount[]>) => (this.bankAccounts = resp.data)
      );
  }
  saveBankAccount(): void{
    const form = this.createFromForm(this.ceiling,this.bankAccountForm.get('bank_account_id')?.value);
    console.log(form)
    this.subscribeToSaveResponse(
      this.fundSourceBudgetClassService.update(form)
    );
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
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
  }


  /**
   * Return form values as object of type FundSourceBudgetClass
   * @returns FundSourceBudgetClass
   */
  protected createFromForm(ceiling: any,bank_account_id: number): FundSourceBudgetClass {
    return {
      ...new FundSourceBudgetClass(),
      id: ceiling.id,
      ceiling_name:  ceiling.id,
      budget_class_id:  ceiling.budget_class_id,
      fund_source_id: ceiling.fund_source_id,
      bank_account_id: bank_account_id,
    };
  }

}
