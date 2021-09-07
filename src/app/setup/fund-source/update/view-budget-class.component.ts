import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {CustomResponse} from "../../../utils/custom-response";
import {FundSourceBudgetClassService} from "../../fund-source-budget-class/fund-source-budget-class.service";
import {BudgetClassService} from "../../budget-class/budget-class.service";
import {FundSource} from "../fund-source.model";
import {ToastService} from "../../../shared/toast.service";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-view-budget-class',
  templateUrl: './view-budget-class.component.html',
  styleUrls: ['./view-budget-class.component.scss']
})
export class ViewBudgetClassComponent implements OnInit {
  @Input() fund_source?:any;
  fundSourcesBudgetClasses?: any[] = [];
  budgetClasses?: any[] = [];
  budgetClassIds?: any[] = [];
  fundSourceBudgetClassForm = this.fb.group({
    fund_source_id: [null, []],
    budget_Classes: [null, [Validators.required]],
    budget_class_id:[null, []],
    ceiling_name:[null, []]
  });
  constructor(
    protected fb: FormBuilder,
    private budgetClassService: BudgetClassService,
    private fundSourceBudgetClassService : FundSourceBudgetClassService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    console.log(this.fund_source)
  }

  onHide(): void {
  }

  saveBudgetClass(): void{
    this.fundSourceBudgetClassForm.get(["fund_source_id"])?.setValue(this.fund_source.id);
    this.fundSourceBudgetClassForm.get(["ceiling_name"])?.setValue(this.fund_source.gfs_code.name);
    this.fundSourceBudgetClassForm.get(["budget_class_id"])?.setValue(2);
    let budgetClasses = this.fundSourceBudgetClassForm.get(["budget_Classes"])?.value;
    let newBudgetClasses = budgetClasses.filter((budgetClass: any) => {
      return !this.budgetClassIds?.includes(budgetClass);
    });
    if(newBudgetClasses.length == 0){
      this.toastService.info('Nothing to save');
      return;
    }
    this.fundSourceBudgetClassForm.get(["budget_Classes"])?.setValue(newBudgetClasses);
    if (this.fundSourceBudgetClassForm.invalid) {
      return;
    }
    this.subscribeToSaveResponse(this.fundSourceBudgetClassService.create(this.fundSourceBudgetClassForm.value));
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FundSource>>
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
    this.loadBudgetClasses();
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
   * Delete FundSource
   * @param fundSource
   */
  delete(row: any): void {
    this.fundSourceBudgetClassService.delete(row.id!).subscribe((resp) => {
      this. loadBudgetClasses();
      this.toastService.info(resp.message);
    });
  }
  loadBudgetClasses() : void{
    this.budgetClassService.getParentChild().subscribe(
      (resp: CustomResponse<any[]>) => (this.budgetClasses = resp.data));
    this.fundSourceBudgetClassService
      .query({fund_source_id: this.fund_source.id,page:1})
      .subscribe(
        (res: CustomResponse<FundSource[]>) => {
          this.fundSourcesBudgetClasses = res?.data ?? [];
          this.budgetClassIds = this.fundSourcesBudgetClasses?.map((budgetClasses: { budget_class: any; })=>budgetClasses.budget_class.id);
          this.fundSourceBudgetClassForm.get(["budget_Classes"])?.setValue(this.budgetClassIds);
        }
      );
  }

}
