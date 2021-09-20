import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AdminHierarchyCeiling} from "../admin-hierarchy-ceiling.model";
import {CeilingChainService} from "../../ceiling-chain/ceiling-chain.service";
import {CustomResponse} from "../../../utils/custom-response";
import {CeilingChain} from "../../ceiling-chain/ceiling-chain.model";
import {AdminHierarchyCeilingService} from "../admin-hierarchy-ceiling.service";
import {ToastService} from "../../../shared/toast.service";
import {AdminHierarchyCeilingComponent} from "../admin-hierarchy-ceiling.component";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-ceiling-dissemination',
  templateUrl: './ceiling-dissemination.component.html',
  styleUrls: ['./ceiling-dissemination.component.scss']
})
export class CeilingDisseminationComponent implements OnInit {
  position?: number;
  ceiling?: any=null;
  department?:AdminHierarchyCeiling[]=[];
  selectedSection?:AdminHierarchyCeiling;
  costCenter?:AdminHierarchyCeiling[]=[];
  sectionLevel?:String;
  facility?:any[]=[];
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
    protected toastService: ToastService
  ) {
    this.ceiling=this.config.data.ceiling;
    this.position=this.config.data.position;
  }

  ngOnInit(): void {
    //get next ceiling Chain
    this.ceilingChainService
      .query({ section_level_position:this.position ,active:true,page:1})
      .subscribe(
        (resp: CustomResponse<CeilingChain[]>) =>{
          this.nextCeilingChain = resp.data??[];
          console.log(this.nextCeilingChain);
          if(this.nextCeilingChain[0].next !==null){
            this.adminHierarchyCeilingService
              .queryCeilingBylevel({
                next:this.nextCeilingChain[0]?.next?.section_level_position,
                position:this.position,
                financial_year_id:this.ceiling?.financial_year_id,
                admin_hierarchy_id:this.ceiling?.admin_hierarchy_id,
                ceiling_id:this.ceiling?.ceiling_id,
                parent_id:this.ceiling?.id,
                section_id:this.ceiling?.section_id,
                budget_type:this.ceiling?.budget_type
              }).subscribe((resp:any) =>{
              this.department=resp.data??[];
              // @ts-ignore
              this.allocatedAmount = this.getTotalAllocatedAmount(this.department);
              // @ts-ignore
              this.sectionLevel = this.department[0].section.section_level.name;
            });
          }else{

          }
        }
      );
  }

  close(): void {
    this.dialogRef.close(true);
  }
  save(): void{

  }
  getPercent(row: AdminHierarchyCeiling){
    // @ts-ignore
    return (this.ceiling?.amount>0?(((row?.amount)/this.ceiling?.amount)*100):0).toFixed(2);
  }

  ceilingChange(event:any,action:String,i:number,row: AdminHierarchyCeiling){
    // @ts-ignore
    const index = this.department.findIndex(item => item.id === row.id);
    if(action=='P') {
      // @ts-ignore
      this.department[index].amount=((event!=null?(this.ceiling.amount/100)*event:0)).toFixed(2);
    }else{
      // @ts-ignore
      this.department[index].amount=event;
    }
    // @ts-ignore
    this.allocatedAmount = this.getTotalAllocatedAmount(this.department);

    if(this.allocatedAmount > this.ceiling.amount){
      // @ts-ignore
      this.department = this.department.map((value, index) => {
        if(value.id==row.id){
          // @ts-ignore
          return this.clonedCeiling[row.id]
        }else{
          return value
        }
      });
      this.allocatedAmount = this.getTotalAllocatedAmount(this.department);
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

  updateCeiling(i:number,row:AdminHierarchyCeiling){
    // @ts-ignore
    if(this.clonedCeiling[row.id].amount != row.amount){
      const adminHierarchyCeiling = this.updateFromForm(row);
      this.subscribeToSaveResponse(
        this.adminHierarchyCeilingService.update(adminHierarchyCeiling)
      );
    }
  }

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
      is_facility:this.nextCeilingChain[0].next.next_id===null
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
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
  }

}
