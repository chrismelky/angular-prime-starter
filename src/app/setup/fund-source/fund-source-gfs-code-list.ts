
import {GfsCode} from "../gfs-code/gfs-code.model";
import {GfsCodeService} from "../gfs-code/gfs-code.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Component} from "@angular/core";
import {CustomResponse} from "../../utils/custom-response";
import {BudgetClassService} from "../budget-class/budget-class.service";
import {ConfirmationService, SelectItemGroup} from "primeng/api";
import {FormBuilder, Validators} from "@angular/forms";
import {FundSourceBudgetClassService} from "./fund-source-budget-class.service";
import {Observable} from "rxjs";
import {FundSource} from "./fund-source.model";
import {finalize} from "rxjs/operators";
import {ToastService} from "../../shared/toast.service";
import {ITEMS_PER_PAGE, PER_PAGE_OPTIONS} from "../../config/pagination.constants";
import {HelperService} from "../../utils/helper.service";
import {Router} from "@angular/router";

@Component({
  template: `
    <p-fieldset  *ngIf="action==='BudgetClass'" legend="Select New Budget Classes">
      <div fxLayout="column" fxLayoutGap="0.5rem">
        <form
          name="editForm"
          role="form"
          novalidate
          (ngSubmit)="save()"
          [formGroup]="fundSourceBudgetClassForm"
        >
          <div class="p-field" fxFlex class="p-col-8">
            <p-multiSelect formControlName="budget_Classes" optionValue="id"  [filter]="true" [itemSize]="34" [options]="budgetClasses!" [group]="true"  defaultLabel="Select Budget Classes" scrollHeight="200px" display="chip">
              <ng-template let-group pTemplate="group">
                <div class="p-d-flex p-ai-center">
                  <span>{{group.label}}</span>
                </div>
              </ng-template>
            </p-multiSelect>
          </div>
          <div class="p-field" fxFlex class="p-col-4" >
            <span fxFlex></span>
            <p-button label="Save" novalidate type="submit" class="p-button-raised" icon="pi pi-check"></p-button>
          </div>
        </form>
      </div>
    </p-fieldset>
    <p-fieldset   legend={{legend}}>
      <div fxLayout="column" fxLayoutGap="2rem">
        <p-table [value]="tableData!"  [paginator]="page" [rows]="100" [responsive]="true"  styleClass="p-datatable-gridlines">
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 4em">SN</th>
              <th pSortableColumn="price">Code <p-sortIcon field="price"></p-sortIcon></th>
              <th pSortableColumn="name">Name <p-sortIcon field="vin"></p-sortIcon></th>
              <th *ngIf="action==='BudgetClass'" style="text-align: end">Action</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row let-i="rowIndex" >
            <tr>
              <td style="width: 4em">{{i+1}}</td>
              <td>{{action==='BudgetClass'?row['budget_class'].code:row.code}}</td>
              <td>{{action==='BudgetClass'?row['budget_class'].name:row.name}}</td>
              <td *ngIf="action==='BudgetClass'" style="text-align: end">
                <button type="button" class="p-button-danger" pButton icon="pi pi-trash" (click)="delete(row)"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template [ngIf]="page" pTemplate="emptymessage"> No data found </ng-template>
        </p-table>
      </div>
    </p-fieldset>
    `
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class FundSourceGfsCodeList {
  tableData: any[] | undefined=[];
  budgetClassIds: any[] =[];
  budgetClasses?: SelectItemGroup[];
  action:any;
  page = false;
  fundSource:any;
  isSaving = false;
  formError = false;
  legend = '';
  errors = [];

  isLoading = false;
  page_no?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects
  fundSourcesBudgetClasses?: any[] = [];
  fundSourceBudgetClassForm = this.fb.group({
    fund_source_id: [null, []],
    budget_Classes: [null, [Validators.required]],
    budget_class_id:[null, []],
    ceiling_name:[null, []]
  });
  constructor(
    private gfsCodeService: GfsCodeService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private budgetClassService: BudgetClassService,
    private fundSourceBudgetClassService:FundSourceBudgetClassService,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected helper: HelperService,
    protected router: Router,
    protected confirmationService: ConfirmationService,
  ) { }
  ngOnInit() : void{
    this.action = this.config.data.action;
    this.fundSource = this.config.data.fund_source;
    this.tableData = [];

    if(this.action==='BudgetClass'){
      this.legend = 'Fund Source Budget Classes'
      this.budgetClassService.getParentChild().subscribe(
        (resp: CustomResponse<any[]>) => (this.budgetClasses = resp.data));
      this.getfundSourceBudgetClass();
    }else{
      this.legend = 'Fund Source GFS CODES'
      this.gfsCodeService.getGfsCode(this.fundSource.gfs_code.aggregated_code!).subscribe((resp) => {
        this.tableData= resp.data;
        this.page=(this.tableData!.length > 0?true:false);
      });
    }
  };


  /**
   * Delete FundSource
   * @param fundSource
   */
  delete(row: any): void {
    this.fundSourceBudgetClassService.delete(row.id!).subscribe((resp) => {
      this.getfundSourceBudgetClass();
      this.toastService.info(resp.message);
    });
  }

  /**
   * When form is valid Create FundSourceBudgetClass type if exist else set form has error and return
   * @returns
   */
  save(): void {
    this.fundSourceBudgetClassForm.get(["fund_source_id"])?.setValue(this.fundSource.id);
    this.fundSourceBudgetClassForm.get(["ceiling_name"])?.setValue(this.fundSource.gfs_code.name);
    this.fundSourceBudgetClassForm.get(["budget_class_id"])?.setValue(2);
    let budgetClasses = this.fundSourceBudgetClassForm.get(["budget_Classes"])?.value;
    let newBudgetClasses = budgetClasses.filter((budgetClass: any) => {
      return !this.budgetClassIds.includes(budgetClass);
    });
    if(newBudgetClasses.length == 0){
      this.toastService.info('Nothing to save');
      return;
    }
    this.fundSourceBudgetClassForm.get(["budget_Classes"])?.setValue(newBudgetClasses);
    if (this.fundSourceBudgetClassForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
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
    this.toastService.info(result.message);
    this.ref.close(true);
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
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  getfundSourceBudgetClass(page?: number, dontNavigate?: boolean): void {
    this.fundSourceBudgetClassService
      .query({fund_source_id: this.fundSource.id,page:1})
      .subscribe(
        (res: CustomResponse<FundSource[]>) => {
          this.isLoading = false;
          this.fundSourcesBudgetClasses = res?.data ?? [];
          this.tableData = this.fundSourcesBudgetClasses?.map((budgetClasses: { budget_class: any; })=>budgetClasses);
          this.budgetClassIds = this.fundSourcesBudgetClasses?.map((budgetClasses: { budget_class: any; })=>budgetClasses.budget_class.id);
          this.fundSourceBudgetClassForm.get(["budget_Classes"])?.setValue(this.budgetClassIds);
        }
      );
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
  }

}
