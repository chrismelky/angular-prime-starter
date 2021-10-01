import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AdminHierarchyCeiling} from "../admin-hierarchy-ceiling.model";
import {CeilingChainService} from "../../../setup/ceiling-chain/ceiling-chain.service";
import {CustomResponse} from "../../../utils/custom-response";
import {CeilingChain} from "../../../setup/ceiling-chain/ceiling-chain.model";
import {AdminHierarchyCeilingService} from "../admin-hierarchy-ceiling.service";
import {ToastService} from "../../../shared/toast.service";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {BudgetCeilingService} from "../../../shared/budget-ceiling.service";
import {FacilityService} from "../../../setup/facility/facility.service";

@Component({
  selector: 'app-ceiling-dissemination',
  templateUrl: './ceiling-dissemination.component.html',
  styleUrls: ['./ceiling-dissemination.component.scss']
})
export class CeilingDisseminationComponent implements OnInit {
  position?: number;
  ceiling?: any=null;
  ceilingChain?: any=null;
  sections?:AdminHierarchyCeiling[]=[];
  sectionLevel?:String;
  loading = false;
  filterValue: string = '';
  next?: number;
  allocatedAmount?: number = 0;
  clonedCeiling?: { [s: string]: AdminHierarchyCeiling; } = {};
  nextCeilingChain?: CeilingChain[]=[];

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    protected ceilingChainService: CeilingChainService,
    protected adminHierarchyCeilingService: AdminHierarchyCeilingService,
    protected toastService: ToastService,
    protected  budgetCeilingService:BudgetCeilingService,
    protected  facilityService:FacilityService
  ) {
    this.ceiling=this.config.data.ceiling;
    this.position=this.config.data.position;
    this.ceilingChain=this.config.data.ceilingChain;
  }

  ngOnInit(): void {
    //Get Next Ceilings
    this.adminHierarchyCeilingService
      .queryCeilingBylevel({
        next:this.ceilingChain?.next?.section_level_position,
        position:this.position,
        financial_year_id:this.ceiling?.financial_year_id,
        admin_hierarchy_id:this.ceiling?.admin_hierarchy_id,
        ceiling_id:this.ceiling?.ceiling_id,
        parent_id:this.ceiling?.id,
        section_id:this.ceiling?.section_id,
        budget_type:this.ceiling?.budget_type
      }).subscribe((resp:any) =>{
      this.sections=resp.data??[];
      // @ts-ignore
      this.allocatedAmount = this.getTotalAllocatedAmount(this.sections);
      // @ts-ignore
      this.sectionLevel = this.sections[0].section.section_level.name;
    });
  }

  close(): void {
    this.dialogRef.close(true);
  }
  save(): void{

  }
  getPercent(row: AdminHierarchyCeiling){
    // @ts-ignore
    return (this.ceiling?.amount>0?(((row?.amount)/this.ceiling?.amount)*100):0).toFixed(0);
  }

  ceilingChange(event:any,action:String,i:number,row: AdminHierarchyCeiling){
    // @ts-ignore
    const index = this.sections.findIndex(item => item.id === row.id);
    if(action=='P') {
      // @ts-ignore
      this.sections[index].amount=((event!=null?(this.ceiling.amount/100)*event:0)).toFixed(2);
    }else{
      // @ts-ignore
      this.sections[index].amount=event;
    }
    // @ts-ignore
    this.allocatedAmount = this.getTotalAllocatedAmount(this.sections);

    if(this.allocatedAmount > this.ceiling.amount){
      // @ts-ignore
      this.sections = this.sections.map((value, index) => {
        if(value.id==row.id){
          // @ts-ignore
          return this.clonedCeiling[row.id]
        }else{
          return value
        }
      });
      this.allocatedAmount = this.getTotalAllocatedAmount(this.sections);
      // @ts-ignore
      delete this.clonedCeiling[row.id];
      this.toastService.info('Ceiling Allocation Cannot Exceed Given Total Ceiling');
    }
  }

  getTotalAllocatedAmount(data: AdminHierarchyCeiling[]){
  // @ts-ignore
    return data.reduce((total, ceiling) => (Number(total) + Number(ceiling!.amount)), 0)
  }

  onEditInit(row:AdminHierarchyCeiling){
    // @ts-ignore
    this.clonedCeiling[row.id] = {...row};
  }

  updateCeiling(row:AdminHierarchyCeiling){
    // @ts-ignore
    if(this.clonedCeiling[row.id].amount != row.amount){
      const adminHierarchyCeiling = this.updateFromForm(row);
      this.subscribeToSaveResponse(
        this.adminHierarchyCeilingService.update(adminHierarchyCeiling)
      );
    }
  }

  // update(row:any,event:any): void{
  //   console.log(event);
  // }

  /**
   * Return form values as object of type AdminHierarchyCeiling
   * @returns AdminHierarchyCeiling
   */
  public updateFromForm(ceiling:any): AdminHierarchyCeiling {
    return {
      ...new AdminHierarchyCeiling(),
      id:ceiling.id,
      ceiling_id:ceiling.ceiling_id ,
      admin_hierarchy_id:ceiling.admin_hierarchy_id,
      financial_year_id: ceiling.financial_year_id,
      parent_id: ceiling.parent_id,
      section_id: ceiling.section_id,
      active: ceiling.active,
      is_locked: ceiling.is_locked,
      is_approved:ceiling.approved,
      budget_type:ceiling.budget_type,
      amount:ceiling.amount,
      // @ts-ignore
      is_facility:this.ceilingChain.next.next_id===null
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

}
