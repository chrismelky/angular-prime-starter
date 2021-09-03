
import {GfsCode} from "../gfs-code/gfs-code.model";
import {GfsCodeService} from "../gfs-code/gfs-code.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Component} from "@angular/core";

@Component({
  template: `
    <div fxLayout="column" fxLayoutGap="0.5rem" *ngIf="action==='BudgetClass'">
      <div class="p-field" fxFlex>
        <label for="reference_type_id"><b>Select Budget Classes</b></label>
      </div>
      <div class="p-field" fxFlex class="p-col-8">
        <span class="p-float-label">
          <p-dropdown
            id="reference_type_id"
            optionValue="id"
            optionLabel="name"
            [autoDisplayFirst]="false"
            [filter]="true"
            class="p-inputtext-sm"
            appendTo="body"
            [options]="tableData!"
            formControlName="reference_type_id"
          ></p-dropdown>
        </span>
      </div>
      <div fxLayout="row" fxLayoutGap="0.75rem" class="p-col-4">
        <span fxFlex></span>
        <button
          class="p-button-raised"
          icon="pi pi-plus"
          label="Add"
          pButton
          type="button"
        ></button>
        <div class="p-field" fxFlex fxLayoutGap="2rem"></div>
      </div>
      <div fxLayout="column" fxLayoutGap="2rem">
        <p-table [value]="tableData!" [paginator]="page" [rows]="5" [responsive]="true">
            <ng-template pTemplate="header">
                <tr>
                    <th>SN</th>
                    <th pSortableColumn="name">Name <p-sortIcon field="vin"></p-sortIcon></th>
                    <th pSortableColumn="price">Code <p-sortIcon field="price"></p-sortIcon></th>
                    <th *ngIf="action==='BudgetClass'">Action</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row >
                <tr>
                    <td>{{1}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.code}}</td>
                  <td *ngIf="action==='BudgetClass'">
                    <button type="button" class="p-button-danger" pButton icon="pi pi-trash" (click)="delete(row)"></button>
                  </td>
                </tr>
            </ng-template>
          <ng-template [ngIf]="page" pTemplate="emptymessage"> No data found </ng-template>
        </p-table>
      </div>
    `
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class FundSourceGfsCodeList {
  tableData: any[]=[];
  action:any;
  page = false;
  fundSource:any;
  constructor(
    private gfsCodeService: GfsCodeService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }
  ngOnInit() : void{
    this.action = this.config.data.action;
    this.fundSource = this.config.data.action;
    this.tableData = [{code:'01200202',name:'test Name'}];
    this.page=(this.tableData.length > 0?true:false);
    console.log(this.config.data);
  };

  delete(row:any){

  }
}
