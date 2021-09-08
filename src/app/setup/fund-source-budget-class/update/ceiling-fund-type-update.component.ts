import {Component, Input, OnInit} from '@angular/core';
import {CustomResponse} from "../../../utils/custom-response";
import {FundType} from "../../fund-type/fund-type.model";
import {FundTypeService} from "../../fund-type/fund-type.service";
import {FormBuilder, Validators} from "@angular/forms";
import {FundSourceBudgetClass} from "../fund-source-budget-class.model";
import {FundSourceBudgetClassService} from "../fund-source-budget-class.service";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {ToastService} from "../../../shared/toast.service";

@Component({
  selector: 'app-ceiling-fund-type-update',
  templateUrl: './ceiling-fund-type-update.component.html',
  styleUrls: ['./ceiling-fund-type-update.component.scss']
})
export class CeilingFundTypeUpdateComponent implements OnInit {
  @Input() ceiling?: any;
  fundTypes?: FundType[] = [];

  fundTypeForm = this.fb.group({
    fund_type_id: [null,[Validators.required]],
  });
  constructor(
    protected fundTypeService: FundTypeService,
    protected fb: FormBuilder,
    protected fundSourceBudgetClassService: FundSourceBudgetClassService,
    protected toastService: ToastService
  ) { }

  ngOnInit(): void {

  }
  loadFundTypes():void{
    this.fundTypeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundType[]>) => (this.fundTypes = resp.data)
      );
  }
  saveFundType(): void{
    const form = this.createFromForm(this.ceiling,this.fundTypeForm.get('fund_type_id')?.value);
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
  protected createFromForm(ceiling: any,fund_type_id: number): FundSourceBudgetClass {
    return {
      ...new FundSourceBudgetClass(),
      id: ceiling.id,
      ceiling_name:  ceiling.id,
      budget_class_id:  ceiling.budget_class_id,
      fund_source_id: ceiling.fund_source_id,
      fund_type_id: fund_type_id,
    };
  }

}
