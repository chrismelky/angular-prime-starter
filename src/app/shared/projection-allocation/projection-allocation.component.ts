import { Component, OnInit } from '@angular/core';
import {AdminHierarchyCeilingService} from "../../budgeting/admin-hierarchy-ceiling/admin-hierarchy-ceiling.service";
import {FinancialYearService} from "../../setup/financial-year/financial-year.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../toast.service";
import {CustomResponse} from "../../utils/custom-response";
import {AdminHierarchyCeiling} from "../../budgeting/admin-hierarchy-ceiling/admin-hierarchy-ceiling.model";
import {FundSourceBudgetClassService} from "../../setup/fund-source-budget-class/fund-source-budget-class.service";
import {ProjectionService} from "../../budgeting/projection/projection.service";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {UserService} from "../../setup/user/user.service";
import {User} from "../../setup/user/user.model";
import {CeilingChain} from "../../setup/ceiling-chain/ceiling-chain.model";
import {FacilityTypeSectionService} from "../../setup/facility-type/facility-type-section/facility-type-section.service";
import {SectionLevel} from "../../setup/section-level/section-level.model";
import {SectionLevelService} from "../../setup/section-level/section-level.service";

@Component({
  selector: 'app-projection-allocation',
  templateUrl: './projection-allocation.component.html',
  styleUrls: ['./projection-allocation.component.scss']
})
export class ProjectionAllocationComponent implements OnInit {
  fund_source_id?: number;
  section_id?: number;
  financial_year_id?: number;
  admin_hierarchy_id?: number;
  adminHierarchyPosition?: number;
  facility_id?: number;
  ceiling: AdminHierarchyCeiling []=[];
  ceilingMapped: any[]=[];
  budget_type: string;
  totalAllocatedAmount: number = 0.00;
  projectionAmount: number = 0.00;
  clonedAllocation: { [s: string]: any; } = {};
  ceilingChain: CeilingChain = {};
  completeCeiling: any[] = [];
  currentUser!: User;
  totalProjection:any = {};
  sectionLevels: SectionLevel[]=[];

  constructor(
    protected adminHierarchyCeilingService: AdminHierarchyCeilingService,
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    private toastService: ToastService,
    private fundSourceBudgetClassService: FundSourceBudgetClassService,
    protected projectionService: ProjectionService,
    protected userService:UserService,
    protected facilityTypeSectionService: FacilityTypeSectionService,
    protected sectionLevelService: SectionLevelService
  ) {
    this.fund_source_id=this.dialogConfig.data.fund_source_id;
    this.section_id = this.dialogConfig.data.section_id;
    this.financial_year_id = this.dialogConfig.data.financial_year_id;
    this.admin_hierarchy_id = this.dialogConfig.data.admin_hierarchy_id;
    this.budget_type = this.dialogConfig.data.budget_type;
    this.facility_id = this.dialogConfig.data.facility_id;
    this.currentUser = userService.getCurrentUser();
    this.section_id = this.currentUser?.section_id;
    this.adminHierarchyPosition = this.dialogConfig.data.adminHierarchyPosition;
    this.ceilingChain = this.dialogConfig.data.ceilingChain
  }

  ngOnInit(): void {
    this.sectionLevelService
      .query({column:['id','name','is_cost_center','position']})
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) =>
          (this.sectionLevels = resp.data??[])
      );
    this.loadData();
    this.getTotalProjection();
  }

  loadData(): void{
    this.fundSourceBudgetClassService
      .query({
        fund_source_id:this.fund_source_id,
        is_active:true,
        per_page:1000,
      })
      .subscribe(
        (resp: CustomResponse<any>) => {
          let budgetClasses = resp.data??[];
          this.adminHierarchyCeilingService
            .ceilingByFundSource({
              fund_source_id:this.fund_source_id,
              financial_year_id:this.financial_year_id,
              admin_hierarchy_id:this.admin_hierarchy_id,
              budget_type:this.budget_type,
              facility_id:this.facility_id,
              section_ids:this.ceilingChain.section.map((c: { id: any; }) => (c.id))
            })
            .subscribe(
              (resp: CustomResponse<any>) => {
                this.ceiling = resp.data ?? [];
                this.completeCeiling = this.ceilingChain.section.map((s: any) => ({id:s.id,name:s.name,ceiling_chain_id:this.ceilingChain.id,next:this.ceilingChain.next_id!==null?true:false,ceiling:
                    budgetClasses.map((bc: { budget_class_id: any; id: any; budget_class: any;fund_source_id:any }) => {
                      const ceiling = this.ceiling!.find(c => c.ceiling.budget_class_id === bc.budget_class_id && s.id === c.section_id);
                      let data = {
                        ceiling_id: bc.id,
                        budget_class:bc.budget_class,
                        amount:ceiling !== undefined?ceiling.amount:0.00,
                        percent:ceiling !== undefined?((ceiling.amount!/this.projectionAmount)*100):0.00,
                        is_locked:ceiling !== undefined?ceiling!.is_locked:false,
                        facility_id:this.facility_id,
                        financial_year_id:this.financial_year_id,
                        admin_hierarchy_id:this.admin_hierarchy_id,
                        budget_class_id:bc.budget_class_id,
                        planning_admin_hierarchy_id:this.admin_hierarchy_id,
                        fund_source_id :bc.fund_source_id,
                        adminHierarchyPosition:this.adminHierarchyPosition,
                        is_cost_center:this.sectionLevels.find((sl)=>sl.position === s.position)!.is_cost_centre,
                        section_id:s.id,
                        admin_hierarchy_ceiling_id:ceiling !== undefined?ceiling.id:undefined
                      };
                      this.clonedAllocation[bc.id] = {...data};
                      return data;
                    })
                }))
                this.totalAllocatedAmount = this.getTotalAllocated(this.completeCeiling);
              }
            );
        }
      );
  }

  saveAllocation(){
    if(!(this.projectionAmount < this.totalAllocatedAmount)){
      let payload = {
        admin_ceilings:this.completeCeiling,
        adminHierarchyPosition: this.adminHierarchyPosition,
      }
      this.subscribeToSaveResponse(this.adminHierarchyCeilingService.projectionAllocation(payload));
    }else{
      this.toastService.error('Allocation Exceeded Total Projection Amount')
    }
  }
  getTotalAllocated(data:any){
    let ceiling: any[] = [];
    for (let val of data) {
      for (let v of val.ceiling) {
        ceiling.push(v);
      }
    }
    return ceiling.reduce((total: any, ceiling: any) => (Number(total) + Number(ceiling!.amount)), 0);
  }

  getPercent(percent:number,data:any,section_id:number,ceilingIndex:number,secIndex:number){
    const x = this.completeCeiling.findIndex((s)=>s.id ===section_id);
    const i = this.completeCeiling[x].ceiling.findIndex((item: { ceiling_id: any; }) => item.ceiling_id === data.ceiling_id);
    this.completeCeiling[secIndex].ceiling[i].percent=+percent;
    this.completeCeiling[secIndex].ceiling[i].amount=((+percent) * this.projectionAmount)/100;
    this.totalAllocatedAmount = this.getTotalAllocated(this.completeCeiling);
  }
  amountChange(amount:number,data:any,section_id:number,ceilingIndex:number,secIndex:number){
    const i = this.completeCeiling[secIndex].ceiling.findIndex((item: { ceiling_id: any; }) => item.ceiling_id === data.ceiling_id);
    this.completeCeiling[secIndex].ceiling[i].amount=amount;
    this.completeCeiling[secIndex].ceiling[i].percent=(amount/this.projectionAmount)*100;
    this.totalAllocatedAmount = this.getTotalAllocated(this.completeCeiling);
  }

  public subscribeToSaveResponse(
    result: Observable<CustomResponse<any>>
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
    this.dialogRef.close(result);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
  }

  getTotalProjection(){
    this.projectionService
      .totalProjection({
        fund_source_id:this.fund_source_id,
        facility_id:this.facility_id,
        financial_year_id:this.financial_year_id,
        admin_hierarchy_id:this.admin_hierarchy_id,
      })
      .subscribe(
        (resp: CustomResponse<any>) => {
          this.totalProjection = resp.data;
          this.projectionAmount =this.totalProjection.amount;
        });
  }

}
