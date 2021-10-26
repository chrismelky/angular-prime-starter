import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('overlayTarget')
  overlayTarget: ElementRef | undefined;

  positionLeft = '0%';
  positionTop = '5em';
  marginStyle = { 'margin-left': this.positionLeft, 'margin-top': this.positionTop };

  selectedCeiling: { [s: string]: AdminHierarchyCeiling; } = {};
  totalAllocatedCeiling: { [s: string]: any; } = {};
  toAllocate?:AdminHierarchyCeiling[]=[];
  allocationPosition?: number;
  totalFacilityAllocatedAmount?: number = 0;
  finalCeiling?: any= {};
  defaultSelected?: { [s: string]: any; } = {};



  position?: number;
  section_id?: number;
  section_level_position?: number;
  selectedDepartment?: number;
  ceilingStartPosition?:number;
  ceilingStartSectionPosition?:number;
  filterValue: string = '';
  facilityFilterValue?: string = '';
  ceiling?: AdminHierarchyCeiling={};
  ceilingChain?: CeilingChain[]=[];
  councilCeilingGroup?: any[]=[];
  facilityCeiling?: any[]=[];
  clonedCeiling?:  any[]= [];
  clonedFacilityCeiling?:  any[]= [];
  facilities?: Facility[]=[];
  budgetCeiling?: BudgetCeiling[]=[];
  councilCeiling?: AdminHierarchyCeiling[]=[];


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
    this.section_level_position = this.config.data.section_level_position;
    this.ceilingStartSectionPosition = this.config.data.ceilingStartSectionPosition;

  }

  ngOnInit(): void {
  this.processCeiling();
  }

  // Process Ceiling
  processCeiling():void{
    this.ceilingChainService
      .queryWithChild({for_admin_hierarchy_level_position:this.position})
      .subscribe(
        (resp: CustomResponse<CeilingChain[]>) =>{
          this.ceilingChain = (resp.data??[]);
          const filteredChain = (resp.data??[]).filter(c => c.section_level_position.position >= (this.section_level_position!)
          ||(c.section_level_position.position == (this.section_level_position!-1) && c.next_id))
          const positions = filteredChain.map((c) => {return c.section_level_position.position});
          let payload = {
            position:positions,
            admin_hierarchy_id:this.ceiling!.admin_hierarchy_id,
            budget_type:this.ceiling!.budget_type,
            financial_year_id:this.ceiling!.financial_year_id,
            ceiling_id:this.ceiling!.ceiling_id
          };
          this.adminHierarchyCeilingService.ceilingByPosition(payload)
            .subscribe((resp: CustomResponse<any>) =>{
              this.councilCeiling = resp.data??[];

              //Creating Ceiling Payload
              this.councilCeilingGroup = filteredChain.map((p) => {const c = this.councilCeiling!.filter( cc => cc.section?.position === p.section_level_position.position)
                return {position:p.section_level_position.position, ceiling:c,label:p.section_level_position.name,chain:p}});

              //Removing Unwanted Item
              const index = this.councilCeilingGroup.findIndex(item => item.position === this.section_level_position);
              this.councilCeilingGroup[index].ceiling = this.councilCeilingGroup[index]!.ceiling!.filter((c: { section_id: number | undefined; })=>c.section_id === this.section_id);
              const parentPosition  = filteredChain.find(fc => fc?.next?.section_level_position.position === this.councilCeilingGroup![index].position)?.section_level_position.position;
              if(parentPosition !== undefined){
                const parentIndex = this.councilCeilingGroup.findIndex(item => item.position === parentPosition);
                this.councilCeilingGroup[parentIndex].ceiling = this.councilCeilingGroup[parentIndex].ceiling.filter((c: { section_id: any; })=>c.section_id === this.councilCeilingGroup![index].ceiling[0]!.section!.parent_id);
              }
              this.updateSelection(this.councilCeilingGroup);
            });
        });
  }

  updateSelection(ceilingGroup:any,startIndex=0,parentPosition=0):void{
    for (let ceiling of ceilingGroup) {
      if(ceiling.ceiling.length > 0){
        if(startIndex == 0){this.defaultSelected![ceiling.position] = {...ceiling.ceiling[0]};}else{
          let ceilingId = this.defaultSelected![parentPosition]?this.defaultSelected![parentPosition]:this.councilCeilingGroup![startIndex-1].ceiling[0];
          this.councilCeilingGroup![startIndex].ceiling = this.councilCeiling!.filter((c) => c.parent_id === ceilingId.id);
          this.defaultSelected![ceiling.position] = {...this.councilCeilingGroup![startIndex].ceiling[0]};
          if(!ceiling.chain.next){
            this.finalCeiling = this.defaultSelected![ceiling.position];
            this.loadFacilityCeiling(this.defaultSelected![ceiling.position]);
          }
        }
        if(ceiling.chain.next){
          let sections = this.councilCeiling!.filter(cc => cc.parent_id == this.defaultSelected![ceiling.position].id);
          this.totalAllocatedCeiling[ceiling.position] = {...{amount:this.getTotalAllocatedAmount(sections)}};
        }
        this.selectedCeiling[ceiling.position] ={...this.defaultSelected![ceiling.position]};
      }
      startIndex++;
    }
  }

  sectionChange(ceiling: any,chain:CeilingChain) : void{
    if(chain.next){
      this.selectedCeiling[chain.section_level_position.position] = {...ceiling};
      let sections = this.councilCeiling!.filter(cc => cc.parent_id == ceiling.id);
      this.totalAllocatedCeiling[chain.section_level_position.position] = {...{amount:this.getTotalAllocatedAmount(sections)}};
      let ceilingData = this.councilCeilingGroup!.filter(cg => cg.position > ceiling.section.position);
      let startIndex = this.councilCeilingGroup!.findIndex(c=>c.position == ceilingData[0].position);
      this.updateSelection(ceilingData,startIndex,chain.section_level_position.position);
    }else{
      this.finalCeiling = ceiling;
      this.loadFacilityCeiling(ceiling);
    }
  }


  allocateCeiling(position:number,table:any,event:any,ceiling:AdminHierarchyCeiling,chain:any):void{
    console.log(ceiling.ceiling)
    this.allocationPosition = position;
    if(ceiling!.amount!>0){
      this.toAllocate = this.councilCeiling!.filter(cc => cc.parent_id == ceiling.id)
      this.toAllocate = this.toAllocate!.map((c) => Object.assign(c,
        {percent: ceiling.amount!>0?((c.amount!/ceiling!.amount!)*100):(0)}));
      this.clonedCeiling = this.toAllocate!.map(c => ({ id: c.id, amount: c.amount,percent:c.percent,section:c.section }));
      table.toggle(event,this.overlayTarget?.nativeElement);
      this.sectionChange(ceiling,chain);
    }else{
      this.toastService.info('No Ceiling To allocate')
    }
  }

  //Load Total allocated  Ceiling
  getAllocatedAmount(ceiling_id: number){
    return this.adminHierarchyCeilingService.queryTotalAllocatedAmount({admin_hierarchy_ceiling_id:ceiling_id});
  }



  //Update Facility Ceiling
  updateFacilityCeiling(row:any):void{
    const index = this.facilityCeiling!.findIndex(item => item.id === row.id);
    if(this.clonedFacilityCeiling![index].amount != row.amount){
      if(this.totalFacilityAllocatedAmount! <= this.finalCeiling!.amount!) {
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
        this.facilityCeiling![index].amount=this.clonedFacilityCeiling![index].amount;
        this.facilityCeiling![index].percent=this.clonedFacilityCeiling![index].percent;
        this.getFacilityPercent(this.clonedFacilityCeiling![index],this.clonedFacilityCeiling![index].percent!);
      }
    }
  }

  //Update Admin Ceiling
  updateCeiling(adminHierarchyCeiling: AdminHierarchyCeiling){
    const index = this.toAllocate!.findIndex(item => item.id === adminHierarchyCeiling.id);
    if(this.clonedCeiling![index].amount != adminHierarchyCeiling.amount){
      if(this.totalAllocatedCeiling[this.allocationPosition!].amount <= this.selectedCeiling[this.allocationPosition!]!.amount!) {
        const ceiling = this.updateFromForm(adminHierarchyCeiling);
        this.subscribeToSaveResponse(
          this.adminHierarchyCeilingService.update(ceiling),adminHierarchyCeiling
        );
      }else{
        this.toAllocate![index].amount=this.clonedCeiling![index].amount;
        this.toAllocate![index].percent=this.clonedCeiling![index].percent;
        this.getPercent(this.clonedCeiling![index],this.clonedCeiling![index].percent!);
      }
    }
  }

  //Facility Ceiling Change
  facilityCeilingChange(row: any,amount:number): void{
    let i = this.facilityCeiling!.findIndex(item => item.id === row.id);
    this.facilityCeiling![i].amount=amount;
    this.facilityCeiling![i].percent=this.finalCeiling!.amount!>0?(amount!/this.finalCeiling!.amount!)*100:0.00;
    this.totalFacilityAllocatedAmount = this.getTotalAllocatedAmount(this.facilityCeiling!);
  }

  //Ceiling Input Change
  ceilingChange(row: AdminHierarchyCeiling,amount:number): void{
    const position=this.ceilingChain!.find(cc => cc.next.section_level_position.position == row.section?.position)!.section_level_position.position;
    const i = this.toAllocate!.findIndex(item => item.id === row.id);
    this.toAllocate![i].amount=amount;
    this.toAllocate![i].percent=this.selectedCeiling[position]!.amount!>0?(amount!/this.selectedCeiling[position].amount!)*100:0.00;
    this.totalAllocatedCeiling[position] = {...{amount:this.getTotalAllocatedAmount(this.toAllocate!)}};
  }
  //Get Facility Percent
  getFacilityPercent(row: any,percent:number): void{
    const i = this.facilityCeiling!.findIndex(item => item.id === row.id);
    this.facilityCeiling![i].percent=percent;
    this.facilityCeiling![i].amount=(percent * this.finalCeiling!.amount!)/100;
    this.totalFacilityAllocatedAmount = this.getTotalAllocatedAmount(this.facilityCeiling!);
  }
  //Percent Input Change
  getPercent(row: AdminHierarchyCeiling,percent:number){;
    const position=this.ceilingChain!.find(c => c.next_id && c.next.section_level_position.position == row.section?.position)?.section_level_position.position;
    const i = this.toAllocate!.findIndex(item => item.id === row.id);
    this.toAllocate![i].percent=percent;
    this.toAllocate![i].amount=(percent * this.selectedCeiling[position].amount!)/100;
    this.totalAllocatedCeiling[position] = {...{amount:this.getTotalAllocatedAmount(this.toAllocate!)}};
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
      admin_ceiling_id:this.finalCeiling!.id ,
      admin_hierarchy_id:this.finalCeiling!.admin_hierarchy_id,
      financial_year_id: this.finalCeiling!.financial_year_id,
      section_id: this.finalCeiling!.section_id,
      is_locked: row.is_locked,
      budget_type:this.finalCeiling!.budget_type,
      amount:row.amount,
      facility_id:row.id,
      ceiling_id:this.finalCeiling!.ceiling_id
    };
  }
  /**
   * Return form values as object of type AdminHierarchyCeiling
   * @returns AdminHierarchyCeiling
   */
  public updateFromForm(ceiling:any): AdminHierarchyCeiling {
    let ceilingChain = this.ceilingChain!.filter(chain => chain.section_level_position.position === ceiling!.section!.position!)[0];
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
      this.facilityCeiling![index].ceilingId = result.data.id
    }else{
      // const index = this.ceilingToDisseminate!.findIndex(item => item.id === ceiling.id);
      this.clonedCeiling = this.toAllocate!.map(c => ({ id: c.id, amount: c.amount,percent:c.percent ,section:c.section}));
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
      const index = this.toAllocate!.findIndex(item => item.id === ceiling.id);
      this.toAllocate![index].amount=this.clonedCeiling![index].amount;
      this.toAllocate![index].percent=this.clonedCeiling![index].percent;
      this.getPercent(this.clonedCeiling![index],this.clonedCeiling![index].percent!);
    }
    this.toastService.error(error.message);
  }

  protected onSaveFinalize(): void {
  }

  closeOverlay(table:Table): void{

  }

  //Load Facility Ceiling
  loadFacilityCeiling(ceiling:any) :void{
    this.facilityService
      .planning(('p'+ this.position),ceiling.admin_hierarchy_id!,ceiling.section_id!).subscribe((resp:any) => {
      this.facilities = resp.data ?? [];
      this.budgetCeilingService
        .query({
          admin_ceiling_id:ceiling?.id,
          per_page:10000
        }).subscribe((res:any) =>{
        this.budgetCeiling=res.data ?? [];
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
        this.clonedFacilityCeiling = this.facilityCeiling!.map(c => ({ id: c.id, amount: c.amount,percent:c.percent }));
        this.totalFacilityAllocatedAmount = this.getTotalAllocatedAmount(this.facilityCeiling!);
        });
    });
  }
  close():void{
    this.dialogRef.close();
  }

}
