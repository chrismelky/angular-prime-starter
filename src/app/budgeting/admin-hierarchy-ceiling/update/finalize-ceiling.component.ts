import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../../../shared/toast.service";
import {BudgetCeilingService} from "../../../shared/budget-ceiling.service";
import {FacilityService} from "../../../setup/facility/facility.service";
import {Facility} from "../../../setup/facility/facility.model";
import {AdminHierarchyCeiling} from "../admin-hierarchy-ceiling.model";
import {BudgetCeiling} from "../../../shared/budget-ceiling.model";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custom-response";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-finalize-ceiling',
  templateUrl: './finalize-ceiling.component.html',
  styleUrls: ['./finalize-ceiling.component.scss']
})
export class FinalizeCeilingComponent implements OnInit {
  position?: string;
  ceiling?: any=null;
  ceilingChain?: any=null;
  facilityCeiling?:any[]=[];
  budgetCeiling?:any[]=[];
  facilities?:Facility[]=[];
  allocatedAmount: number=0;
  filterValue: string= '';
  clonedCeiling?: { [s: string]: any; } = {};
  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    protected toastService: ToastService,
    protected  budgetCeilingService:BudgetCeilingService,
    protected  facilityService:FacilityService,
  ) {
    this.ceiling=this.config.data.ceiling;
    this.position = 'p'+ this.config.data.position;
    this.ceilingChain=this.config.data.ceilingChain;
  }

  ngOnInit(): void {
    this.facilityService
      .planning(this.position!,this.ceiling.admin_hierarchy_id,this.ceiling.section_id).subscribe((resp:any) =>{
      this.facilities=resp.data??[];
      this.budgetCeilingService
        .query({
          admin_ceiling_id:this.ceiling?.id,
        }).subscribe((resp:any) =>{
        this.budgetCeiling=resp.data??[];
        this.facilityCeiling = this.facilities!.map((facility) => {
          const ceiling = this.budgetCeiling!.find(ceiling => ceiling.facility_id === facility.id)
          return{
            id:facility.id,
            ceilingId:ceiling==undefined?null:ceiling!.id,
            council:this.ceiling.admin_hierarchy.name,
            facility: '['+facility.code+'] ' + facility.name,
            amount:ceiling==undefined?0.00:ceiling.amount,
            is_locked:ceiling==undefined?false:ceiling!.is_locked
          }
        });
        this.allocatedAmount = this.getTotalAllocatedAmount(this.facilityCeiling);
      });
    });
  }
  //Return total Allocated Amount
  getTotalAllocatedAmount(data: any[]){
    // @ts-ignore
    return data.reduce((total, ceiling) => (Number(total) + Number(ceiling!.amount)), 0)
  }

  //Store defalth value on ceiling cahnge process
  onEditInit(row:any){
    // @ts-ignore
    this.clonedCeiling[row.id] = {...row};
  }

  //Update Celing Changes
  updateCeiling(row:any){
    // @ts-ignore
    if(this.clonedCeiling[row.id].amount != row.amount){
      const facilityCeiling = this.updateFromForm(row);
      if(facilityCeiling.id !== null){
        this.subscribeToSaveResponse(
          this.budgetCeilingService.update(facilityCeiling)
        );
      }else{
        this.subscribeToSaveResponse(
          this.budgetCeilingService.create(facilityCeiling)
        );
      }
    }
  }

  //Track Celing Changes
  ceilingChange(event:string,action:String,row: any){
    // @ts-ignore
    const index = this.facilityCeiling.findIndex(item => item.id === row.id);
    if(action=='P') {
      // @ts-ignore
      this.facilityCeiling[index].amount=((event!=null?(this.ceiling.amount/100)*event:0)).toFixed(2);
    }else{
      // @ts-ignore
      this.facilityCeiling[index].amount=event;
    }
    // @ts-ignore
    this.allocatedAmount = this.getTotalAllocatedAmount(this.facilityCeiling);

    if(this.allocatedAmount > this.ceiling.amount){
      // @ts-ignore
      this.facilityCeiling = this.facilityCeiling.map((value, index) => {
        if(value.id==row.id){
          // @ts-ignore
          return this.clonedCeiling[row.id]
        }else{
          return value
        }
      });
      this.allocatedAmount = this.getTotalAllocatedAmount(this.facilityCeiling);
      // @ts-ignore
      delete this.clonedCeiling[row.id];
      this.toastService.info('Ceiling Allocation Cannot Exceed Given Total Ceiling');
    }
  }

  //this return Allocated Paercet
  getPercent(row: AdminHierarchyCeiling){
    // @ts-ignore
    return (this.ceiling?.amount>0?(((row?.amount)/this.ceiling?.amount)*100):0).toFixed(2);
  }

  /**
   * Return form values as object of type AdminHierarchyCeiling
   * @returns AdminHierarchyCeiling
   */
  public updateFromForm(row:any): BudgetCeiling {
    return {
      ...new BudgetCeiling(),
      id:row.ceilingId,
      admin_ceiling_id:this.ceiling.id ,
      admin_hierarchy_id:this.ceiling.admin_hierarchy_id,
      financial_year_id: this.ceiling.financial_year_id,
      section_id: this.ceiling.section_id,
      is_locked: row.is_locked,
      budget_type:this.ceiling.budget_type,
      amount:row.amount,
      facility_id:row.id
    };
  }
  public subscribeToSaveResponse(
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
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {
    this.toastService.error(error);
  }

  protected onSaveFinalize(): void {
  }

  close(): void {
    this.dialogRef.close(true);
  }

}
