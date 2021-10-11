import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {CeilingChainService} from "../../../setup/ceiling-chain/ceiling-chain.service";
import {AdminHierarchyCeilingService} from "../admin-hierarchy-ceiling.service";
import {ToastService} from "../../../shared/toast.service";
import {BudgetCeilingService} from "../../../shared/budget-ceiling.service";
import {FacilityService} from "../../../setup/facility/facility.service";
import {FormBuilder, Validators} from "@angular/forms";
import {CustomResponse} from "../../../utils/custom-response";
import {FinancialYear} from "../../../setup/financial-year/financial-year.model";
import {CeilingChain} from "../../../setup/ceiling-chain/ceiling-chain.model";
import {Section} from "../../../setup/section/section.model";
import {SectionService} from "../../../setup/section/section.service";
import {concatAll, finalize} from "rxjs/operators";
import {AdminHierarchyCeiling} from "../admin-hierarchy-ceiling.model";
import {Table} from "primeng/table";
import {Observable} from "rxjs";
import {Facility} from "../../../setup/facility/facility.model";
import {BudgetCeiling} from "../../../shared/budget-ceiling.model";

@Component({
  selector: 'app-admin-ceiling-dissemination',
  templateUrl: './admin-ceiling-dissemination.component.html',
  styleUrls: ['./admin-ceiling-dissemination.component.scss']
})
export class AdminCeilingDisseminationComponent implements OnInit {
  position?: number;
  section_id?: number;
  section_level_position?: number;
  selectedCostCenter?: number;
  selectedDepartment?: number;
  ceilingStartPosition?:number;
  filterValue: string = '';
  facilityFilterValue?: string = '';
  ceiling?: AdminHierarchyCeiling={};
  departmentCeiling?: AdminHierarchyCeiling={};
  costCenterCeiling?: AdminHierarchyCeiling={};
  currentActiveCeiling?: AdminHierarchyCeiling={};
  ceilingChain?: CeilingChain[]=[];
  ceilingToDisseminate?: AdminHierarchyCeiling[]=[];
  allChain?: CeilingChain[]=[];
  facilityCeiling?: any[]=[];
  departments?: any[]=[];
  costCenter?: any[]=[];
  department?: Section={};
  activeCostCenter?: Section={};
  ceilingAllocationLevel?:number;
  clonedCeiling?:  any[]= [];
  facilities?: Facility[]=[];
  budgetCeiling?: BudgetCeiling[]=[];


  totalAllocatedDepartmentAmount = 0.00;
  totalAllocatedCostCenterAmount = 0.00;
  totalCouncilAmount = 0.00;
  currentAllocatedAmount = 0.00;

  /**
   * Declare form
   */
  ceilingForm = this.fb.group({
    departmentId: [null, []],
    depTotalAmount: [null, [Validators.required]],
    costCenterId: [null, [Validators.required]],
    costTotalAmount: [null, [Validators.required]],
  });
  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    protected fb: FormBuilder,
    protected ceilingChainService: CeilingChainService,
    protected sectionService: SectionService,
    protected adminHierarchyCeilingService: AdminHierarchyCeilingService,
    protected toastService: ToastService,
    protected  budgetCeilingService:BudgetCeilingService,
    protected  facilityService:FacilityService
  ) {
    this.ceiling=this.config.data.ceiling;
    this.position = this.config.data.position;
    this.ceilingStartPosition = this.config.data.ceilingStartPosition;
    this.section_id = this.config.data.section_id;
    this.section_level_position = this.config.data.section_level_position

  }

  ngOnInit(): void {
    this.ceilingChainService
      .queryWithChild({for_admin_hierarchy_level_position:this.ceilingStartPosition})
      .subscribe(
        (resp: CustomResponse<CeilingChain[]>) =>{
          this.ceilingChain = (resp.data??[]).filter(chain => chain.section_level_position.position !== 1);
          this.allChain = (resp.data??[]);
          if(this.ceilingChain!.length <= 0){
            this.toastService.info("Please Set Ceiling Chain to Proceed ...");
            this.dialogRef.close();
          }else{
            const index = this.ceilingChain.findIndex(item => item.section_level_position.position === this.section_level_position);
            if(index == -1){
              this.loadAtCeilingStartLevel(this.ceilingChain[0])
            }else{
              if(this.ceilingChain[index].next_id){
                this.loadNextLevel(index);
              }else{
                this.loadFinal(index);
              }
            }
          }
        }
      );
  }

  //Loading Department and Ceilings
  loadAtCeilingStartLevel(ceilingChain:any){
    this.getAllocatedAmount(this.ceiling!.id!).then(res => {this.totalCouncilAmount = res.data});
    this.sectionService
      .query({position:ceilingChain.section_level_position.position})
      .subscribe(
        (res: CustomResponse<Section[]>) =>{
          this.departments = res.data??[];
          this.selectedDepartment = this.departments[0].id;

          this.adminHierarchyCeilingService.queryCeilingWithChildren({parent_id:this.ceiling!.id,section_id:this.selectedDepartment })
            .subscribe((resp: CustomResponse<any>) =>{
              this.departmentCeiling = resp.data!.length>0?resp.data![0]:{};
              this.getAllocatedAmount(this.departmentCeiling!.id!).then(res => {this.totalAllocatedDepartmentAmount = res.data});
            });
          this.sectionService.query({parent_id:this.selectedDepartment })
            .subscribe((res: CustomResponse<Section[]>) =>{
              this.costCenter = res.data??[];
              this.selectedCostCenter = this.costCenter[0].id
              this.adminHierarchyCeilingService.queryCeilingWithChildren({parent_id:this.departmentCeiling!.id,section_id:this.selectedCostCenter })
                .subscribe((resp: CustomResponse<any>) =>{
                  this.costCenterCeiling = resp.data!.length>0?resp.data![0]:{};
                  this.loadFacilityCeiling(this.costCenterCeiling!);
                });
            });
        }
      );
  }

  //Loading Department and Ceilings
  loadNextLevel(index:any){
    this.departmentCeiling = this.ceiling;
    this.sectionService
      .find(this.section_id!)
      .subscribe(
        (res: CustomResponse<Section>) =>{
          this.departments = res.data?[res.data]:[];
          this.selectedDepartment = this.departments[0].id;
          this.getAllocatedAmount(this.departmentCeiling!.id!).then(res => {this.totalAllocatedDepartmentAmount = res.data});
          this.sectionService.query({parent_id:this.selectedDepartment })
            .subscribe((res: CustomResponse<Section[]>) =>{
              this.costCenter = res.data??[];
              this.selectedCostCenter = this.costCenter[0].id;
              this.adminHierarchyCeilingService.queryCeilingWithChildren({parent_id:this.departmentCeiling!.id,section_id:this.selectedCostCenter })
                .subscribe((resp: CustomResponse<AdminHierarchyCeiling[]>) =>{
                  this.costCenterCeiling = resp.data!.length>0?resp.data![0]:{};
                  this.loadFacilityCeiling(this.costCenterCeiling!);
                });

            });
        }
      );
  }

  // Loading Cost Center and Ceiling
  loadFinal(index:any){
    this.sectionService
      .find(this.section_id!)
      .subscribe(
        (res: CustomResponse<Section>) =>{
          this.costCenter = res.data?[res.data]:[];
          this.selectedCostCenter = this.costCenter[0].id;
          this.costCenterCeiling = this.ceiling;
          this.loadFacilityCeiling(this.costCenterCeiling!);
          this.sectionService
            .find(this.costCenter[0].parent_id)
            .subscribe(
              (res: CustomResponse<Section>) =>{
                this.departments = res.data?[res.data]:[];
                this.selectedDepartment = this.departments[0].id
                this.adminHierarchyCeilingService
                  .find(this.ceiling?.parent_id)
                  .subscribe(
                    (res: CustomResponse<AdminHierarchyCeiling>) =>{
                      this.departmentCeiling = res.data??{};
                      this.getAllocatedAmount(this.departmentCeiling!.id!).then(res => {this.totalAllocatedDepartmentAmount = res.data});
                    }
                  );
              }
            );
        }
      );
  }

  // Track On Department  Change
  onSelectDepartment(id:number){
    this.facilityCeiling = [];
    this.departmentCeiling = {};
    this.costCenterCeiling={};
    this.adminHierarchyCeilingService.queryCeilingWithChildren({parent_id:this.ceiling!.id,section_id:id})
      .subscribe((resp: CustomResponse<any>) =>{
        this.departmentCeiling = resp.data!.length>0?resp.data![0]:{};
        this.getAllocatedAmount(this.departmentCeiling!.id!).then(res => {this.totalAllocatedDepartmentAmount = res.data});
      });
    this.sectionService.query({parent_id:id})
      .subscribe((res: CustomResponse<Section[]>) =>{
        this.costCenter = res.data??[];
        this.selectedCostCenter = this.costCenter[0].id
        this.adminHierarchyCeilingService.queryCeilingWithChildren({parent_id:this.departmentCeiling!.id,section_id:this.selectedCostCenter })
          .subscribe((resp: CustomResponse<any>) =>{
            this.costCenterCeiling = resp.data!.length>0?resp.data![0]:{};
          });
      });
  }

  // Track On Cost Center   Change
  onSelectCostCenter(id:number){
    this.facilityCeiling = [];
    this.costCenterCeiling={};
    this.adminHierarchyCeilingService.queryCeilingWithChildren({parent_id:this.departmentCeiling!.id,section_id:id })
      .subscribe((resp: CustomResponse<any>) =>{
        this.costCenterCeiling = resp.data!.length>0?resp.data![0]:{};
        this.loadFacilityCeiling(this.costCenterCeiling!);
      });
  }


  //Load Total allocated  Ceiling
  getAllocatedAmount(ceiling_id: number){
    return this.adminHierarchyCeilingService.queryTotalAllocatedAmount({admin_hierarchy_ceiling_id:ceiling_id});
  }

  openDialog(op: any,position: number,event:any,ceiling: AdminHierarchyCeiling){
    op.toggle(event);
    this.ceilingAllocationLevel=position;
    this.currentActiveCeiling = ceiling;
  }

  // Load Ceiling By Position
  public  getCeilingByLevel(){

    const chain = this.allChain!.filter(chain => chain.section_level_position.position === this.ceilingAllocationLevel)[0];
    //Get Next Ceilings
    this.adminHierarchyCeilingService
      .queryCeilingBylevel({
        next:chain?.next?.section_level_position?.position,
        position:this.position,
        financial_year_id:this.ceiling?.financial_year_id,
        admin_hierarchy_id:this.ceiling?.admin_hierarchy_id,
        ceiling_id:this.ceiling?.ceiling_id,
        parent_id:this.currentActiveCeiling?.id,
        section_id:this.ceiling?.section_id,
        budget_type:this.ceiling?.budget_type
      }).subscribe((resp:any) =>{
        this.ceilingToDisseminate =(resp.data??[]).map((c: { amount: any; }) => Object.assign(c,
          {percent: this.currentActiveCeiling!.amount!>0?((c.amount!/this.currentActiveCeiling!.amount!)*100):(0)}));
        this.clonedCeiling = this.ceilingToDisseminate!.map(c => ({ id: c.id, amount: c.amount,percent:c.percent }));
        this.currentAllocatedAmount = this.getTotalAllocatedAmount(this.ceilingToDisseminate!);
    });
  }

  //Update Facility Ceiling
  updateFacilityCeiling(row:any):void{
    const index = this.facilityCeiling!.findIndex(item => item.id === row.id);
    if(this.clonedCeiling![index].amount != row.amount){
      if(this.totalAllocatedCostCenterAmount <= this.costCenterCeiling!.amount!) {
        const facilityCeiling = this.facilityUpdateCeilingFrom(row);
        if(facilityCeiling.id !== null){
          this.subscribeToSaveResponse(
            this.budgetCeilingService.update(facilityCeiling),row
          );
        }else{
          this.subscribeToSaveResponse(
            this.budgetCeilingService.create(facilityCeiling),row
          );
        }
      }else{
        this.facilityCeiling![index].amount=this.clonedCeiling![index].amount;
        this.facilityCeiling![index].percent=this.clonedCeiling![index].percent;
        this.getFacilityPercent(this.clonedCeiling![index],this.clonedCeiling![index].percent!);
      }
    }
  }

  //Update Admin Ceiling
  updateCeiling(adminHierarchyCeiling: AdminHierarchyCeiling){
    const index = this.ceilingToDisseminate!.findIndex(item => item.id === adminHierarchyCeiling.id);
    if(this.clonedCeiling![index].amount != adminHierarchyCeiling.amount){
    if(this.currentAllocatedAmount <= this.currentActiveCeiling!.amount!) {
      const ceiling = this.updateFromForm(adminHierarchyCeiling);
      this.subscribeToSaveResponse(
        this.adminHierarchyCeilingService.update(ceiling),adminHierarchyCeiling
      );
    }else{
      this.ceilingToDisseminate![index].amount=this.clonedCeiling![index].amount;
      this.ceilingToDisseminate![index].percent=this.clonedCeiling![index].percent;
      this.getPercent(this.clonedCeiling![index],this.clonedCeiling![index].percent!);
    }
    }
  }

  //Facility Ceiling Change
  facilityCeilingChange(row: any,amount:number): void{
    let i = this.facilityCeiling!.findIndex(item => item.id === row.id);
    this.facilityCeiling![i].amount=amount;
    this.facilityCeiling![i].percent=this.costCenterCeiling!.amount!>0?(amount!/this.costCenterCeiling!.amount!)*100:0.00;
      this.totalAllocatedCostCenterAmount = this.getTotalAllocatedAmount(this.facilityCeiling!);
  }

  //Ceiling Input Change
  ceilingChange(row: AdminHierarchyCeiling,amount:number): void{
    const i = this.ceilingToDisseminate!.findIndex(item => item.id === row.id);
    this.ceilingToDisseminate![i].amount=amount;
    this.ceilingToDisseminate![i].percent=this.currentActiveCeiling!.amount!>0?(amount!/this.currentActiveCeiling!.amount!)*100:0.00;
    this.currentAllocatedAmount = this.getTotalAllocatedAmount(this.ceilingToDisseminate!);
    if(this.ceilingChain!.filter(chain => chain.section_level_position.position === this.currentActiveCeiling?.section?.position).length <=0){
      this.totalCouncilAmount = this.currentAllocatedAmount
    }else{
      this.totalAllocatedDepartmentAmount = this.currentAllocatedAmount
    }

  }
  //Get Facility Percent
  getFacilityPercent(row: any,percent:number): void{
    const i = this.facilityCeiling!.findIndex(item => item.id === row.id);
    this.facilityCeiling![i].percent=percent;
    this.facilityCeiling![i].amount=(percent * this.costCenterCeiling!.amount!)/100;
    this.totalAllocatedCostCenterAmount = this.getTotalAllocatedAmount(this.facilityCeiling!);
  }
  //Percent Input Change
  getPercent(row: AdminHierarchyCeiling,percent:number){
    const i = this.ceilingToDisseminate!.findIndex(item => item.id === row.id);
    this.ceilingToDisseminate![i].percent=percent;
    this.ceilingToDisseminate![i].amount=(percent * this.currentActiveCeiling!.amount!)/100;
    this.currentAllocatedAmount = this.getTotalAllocatedAmount(this.ceilingToDisseminate!);
    if(this.ceilingChain!.filter(chain => chain.section_level_position.position === this.currentActiveCeiling?.section?.position).length <=0){
      this.totalCouncilAmount = this.currentAllocatedAmount
    }else{
      this.totalAllocatedDepartmentAmount = this.currentAllocatedAmount
    }
  }

  //Get Allocated Amount
  getTotalAllocatedAmount(data: any[]){
    return data.reduce((total, ceiling) => (Number(total) + Number(ceiling!.amount)), 0)
  }

  /**
   * Return form values as object of type AdminHierarchyCeiling
   * @returns AdminHierarchyCeiling
   */
  public facilityUpdateCeilingFrom(row:any): BudgetCeiling {
    return {
      ...new BudgetCeiling(),
      id:row.ceilingId,
      admin_ceiling_id:this.costCenterCeiling!.id ,
      admin_hierarchy_id:this.costCenterCeiling!.admin_hierarchy_id,
      financial_year_id: this.costCenterCeiling!.financial_year_id,
      section_id: this.costCenterCeiling!.section_id,
      is_locked: row.is_locked,
      budget_type:this.costCenterCeiling!.budget_type,
      amount:row.amount,
      facility_id:row.id
    };
  }
  /**
   * Return form values as object of type AdminHierarchyCeiling
   * @returns AdminHierarchyCeiling
   */
  public updateFromForm(ceiling:any): AdminHierarchyCeiling {
    let ceilingChain = this.ceilingChain!.filter(chain => chain.section_level_position.position === ceiling!.section!.position!)[0];
    console.log(ceilingChain)
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
      is_facility:ceilingChain.next===null
    };
  }
  public subscribeToSaveResponse(
    result: Observable<CustomResponse<any>>,ceiling:any
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result,ceiling),
      (error) => this.onSaveError(error,ceiling)
    );
  }

  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any,ceiling:any): void {
    if ('facility' in ceiling){
      const index = this.facilityCeiling!.findIndex(item => item.id === ceiling.id);
      this.clonedCeiling = this.facilityCeiling!.map(c => ({ id: c.id, amount: c.amount,percent:c.percent }));
    }else{
      const index = this.ceilingToDisseminate!.findIndex(item => item.id === ceiling.id);
      this.clonedCeiling = this.ceilingToDisseminate!.map(c => ({ id: c.id, amount: c.amount,percent:c.percent }));
    }
    this.toastService.info(result.message);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any,ceiling:any): void {
    if ('facility' in ceiling){
      const index = this.facilityCeiling!.findIndex(item => item.id === ceiling.id);
      this.facilityCeiling![index].amount=this.clonedCeiling![index].amount;
      this.facilityCeiling![index].percent=this.clonedCeiling![index].percent;
      this.getPercent(this.clonedCeiling![index],this.clonedCeiling![index].percent!);
    }else{
      const index = this.ceilingToDisseminate!.findIndex(item => item.id === ceiling.id);
      this.ceilingToDisseminate![index].amount=this.clonedCeiling![index].amount;
      this.ceilingToDisseminate![index].percent=this.clonedCeiling![index].percent;
      this.getPercent(this.clonedCeiling![index],this.clonedCeiling![index].percent!);
    }
    this.toastService.error(error.message);
  }

  protected onSaveFinalize(): void {
  }

  closeOverlay(table:Table): void{
    this.filterValue = "";
  }

  //Load Facility Ceiling
  loadFacilityCeiling(ceiling:any) :void{
    this.facilityService
      .planning(('p'+ this.position),ceiling.admin_hierarchy_id!,ceiling.section_id!).subscribe((resp:any) => {
      this.facilities = resp.data ?? [];
      this.budgetCeilingService
        .query({
          admin_ceiling_id:this.costCenterCeiling?.id,
        }).subscribe((resp:any) =>{
        this.budgetCeiling=resp.data??[];
        this.facilityCeiling = this.facilities!.map((facility) => {
          const budgetCeiling = this.budgetCeiling!.find(ceiling => ceiling.facility_id === facility.id)
          return{
            id:facility.id,
            ceilingId:budgetCeiling==undefined?null:budgetCeiling!.id,
            council:ceiling.admin_hierarchy.name,
            facility: '['+facility.code+'] ' + facility.name,
            amount:budgetCeiling==undefined?0.00:budgetCeiling.amount,
            is_locked:budgetCeiling==undefined?false:budgetCeiling!.is_locked,
            percent:budgetCeiling==undefined?0.00:((budgetCeiling.amount!)>0?(((budgetCeiling.amount!)/ceiling.amount)*100):0.00)
          }
        });
        this.clonedCeiling = this.facilityCeiling!.map(c => ({ id: c.id, amount: c.amount,percent:c.percent }));
        this.totalAllocatedCostCenterAmount =this.getTotalAllocatedAmount(this.facilityCeiling!);
        });
    });
  }

}
