import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {CeilingChainService} from "../../../setup/ceiling-chain/ceiling-chain.service";
import {AdminHierarchyCeilingService} from "../admin-hierarchy-ceiling.service";
import {ToastService} from "../../../shared/toast.service";
import {BudgetCeilingService} from "../../../shared/budget-ceiling.service";
import {FacilityService} from "../../../setup/facility/facility.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomResponse} from "../../../utils/custom-response";
import {CeilingChain} from "../../../setup/ceiling-chain/ceiling-chain.model";
import {SectionService} from "../../../setup/section/section.service";
import {finalize} from "rxjs/operators";
import {AdminHierarchyCeiling} from "../admin-hierarchy-ceiling.model";
import {Observable} from "rxjs";
import {Facility} from "../../../setup/facility/facility.model";
import {BudgetCeiling} from "../../../shared/budget-ceiling.model";
import {Papa} from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import {MessageService} from 'primeng/api';

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
  adminCeilingByLevel: any = {};

  toAllocate?:AdminHierarchyCeiling[]=[];
  allocationPosition?: number;
  totalFacilityAllocatedAmount?: number = 0;
  finalCeiling?: any= {};
  defaultSelected?: { [s: string]: any; } = {};
  currentCeilingChain?: CeilingChain = {};
  parentCeiling?: AdminHierarchyCeiling[]=[];
  allCeilingChain?: CeilingChain[]=[];
  uploadedFiles: any[] = [];

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
  ceilingUploadFrom! :FormGroup;
  facilityCeilingToUpload: any[] = [];
  facilityOverlay!:any;


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
    protected  facilityService:FacilityService,
    private papa: Papa,
    private messageService: MessageService
  ) {
    this.ceiling=this.config.data.ceiling;
    this.parentCeiling =[this.config.data.ceiling];
    this.position = this.config.data.position;
    this.ceilingStartPosition = this.config.data.ceilingStartPosition;
    this.section_id = this.config.data.section_id;
    this.section_level_position = this.config.data.section_level_position;
    this.ceilingStartSectionPosition = this.config.data.ceilingStartSectionPosition;
    this.ceilingUploadFrom = this.fb.group({
      admin_hierarchy_id: null,
      financial_year_id:null,
      section_id: null,
      ceiling_id: null,
      fund_source_id: null,
      admin_hierarchy_ceiling_id:null,
      file:[]
    })
  }

  ngOnInit(): void {
    this.loadCeilingChain()
  }
  loadCeilingChain(){
    this.ceilingChainService
      .queryWithChild({for_admin_hierarchy_level_position:this.position})
      .subscribe(
        (resp: CustomResponse<CeilingChain[]>) => {
          this.allCeilingChain = (resp.data ?? []);
          this.ceilingChain = (resp.data ?? []).filter(cc => cc.section_level_position.position > this.ceiling!.section!.section_level?.position!);
          this.currentCeilingChain = (resp.data ?? []).find(cc=> cc.section_level_position.position == this.ceiling!.section!.section_level?.position!);
          this.selectedCeiling[this.currentCeilingChain!.section_level_position.position] ={...this.ceiling};
          if(this.currentCeilingChain!.next_id){
            this.getChildCeiling(this.ceiling!,this.currentCeilingChain);
          }else{
            this.finalCeiling = this.ceiling;
            this.loadFacilityCeiling(this.ceiling);
          }
        });
  }

  onchange(ceiling:any,chain:CeilingChain){
    this.selectedCeiling[chain.section_level_position.position] ={...ceiling};
    if(chain.next_id){
      this.getChildCeiling(ceiling,chain);
    }else{
      this.loadFacilityCeiling(ceiling);
      this.finalCeiling = ceiling;
    }
  }
  getChildCeiling(ceiling: AdminHierarchyCeiling,chain: CeilingChain = {}){
    this.adminHierarchyCeilingService
      .queryCeilingWithChildren({
        per_page: 1000,
        admin_hierarchy_id: ceiling!.admin_hierarchy_id,
        financial_year_id: ceiling!.financial_year_id,
        budget_type: ceiling!.budget_type,
        parent_id:ceiling.id,
        sector_ids:this.ceiling!.ceiling.sector.map((c: { id: any; }) => (c.id))
      })
      .subscribe(
        (res: CustomResponse<AdminHierarchyCeiling[]>) => {
          this.toAllocate = res.data ?? [];
          this.toAllocate = this.toAllocate!.map((c) => Object.assign(c,
            {percent: ceiling.amount!>0?((c.amount!/ceiling!.amount!)*100):(0)}));
          this.totalAllocatedCeiling[chain.section_level_position.position] = {...{amount:this.getTotalAllocatedAmount(this.toAllocate!)}};
          this.adminCeilingByLevel[(chain.next.section_level_position.position)] = this.toAllocate;
          this.clonedCeiling = this.toAllocate!.map(c => ({ id: c.id, amount: c.amount,percent:c.percent ,section:c.section}));
        }
      );
  }


  allocateCeiling(position:number,table:any,event:any,ceiling:AdminHierarchyCeiling,chain:any):void{
    this.allocationPosition = position;
    this.selectedCeiling[chain.section_level_position.position] ={...ceiling};
    if(ceiling!.amount!>0){
      this.getChildCeiling(ceiling,chain);
      table.toggle(event,this.overlayTarget?.nativeElement);
    }else{
      this.toastService.info('No Ceiling To allocate')
    }
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
    this.totalAllocatedCeiling[this.finalCeiling?.section?.position] = {...{amount:this.getTotalAllocatedAmount(this.facilityCeiling!)}};
  }

  //Ceiling Input Change
  ceilingChange(row: AdminHierarchyCeiling,amount:number): void{
    const position=this.allCeilingChain!.find(cc => cc.next.section_level_position.position == row.section?.position)!.section_level_position.position;
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
    this.totalAllocatedCeiling[this.finalCeiling?.section?.position] = {...{amount:this.getTotalAllocatedAmount(this.facilityCeiling!)}};
  }

  //Percent Input Change
  getPercent(row: AdminHierarchyCeiling,percent:number){
    const position=this.allCeilingChain!.find(c => c.next_id && c.next.section_level_position.position == row.section?.position)?.section_level_position.position;
    const i = this.toAllocate!.findIndex(item => item.id === row.id);
    this.toAllocate![i].percent=percent;
    this.toAllocate![i].amount=(percent * this.selectedCeiling[position!].amount!)/100;
    this.adminCeilingByLevel[row.section?.position!][i].amount=(percent * this.selectedCeiling[position!].amount!)/100;
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
      planning_admin_hierarchy_id: row.planning_admin_hierarchy_id,
      fund_source_id:row.fund_source_id,
      budget_class_id:row.budget_class_id,
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
      this.clonedFacilityCeiling = this.facilityCeiling!.map(c => ({ id: c.id, amount: c.amount,percent:c.percent }));
      this.facilityCeiling![index].ceilingId = result.data.id
      this.totalAllocatedCeiling[this.finalCeiling?.section?.position] = {...{amount:this.getTotalAllocatedAmount(this.facilityCeiling!)}};
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
    if ('facility' in ceiling) {
      const index = this.facilityCeiling!.findIndex(item => item.id === ceiling.id);
      this.facilityCeiling![index].amount = this.clonedFacilityCeiling![index].amount;
      this.facilityCeiling![index].percent = this.clonedFacilityCeiling![index].percent;
      this.getPercent(this.clonedFacilityCeiling![index], this.clonedFacilityCeiling![index].percent!);
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

  //Load Facility Ceiling
  loadFacilityCeiling(ceiling:any) :void{
    if(ceiling !== undefined){
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
            const budgetCeiling = this.budgetCeiling!.find(ceiling => ceiling.facility_id === facility.id);
            const position = 'p'+facility.planning_hierarchy_position;
            return{
              id:facility.id,
              ceilingId:budgetCeiling==undefined?null:budgetCeiling!.id,
              ceiling_id:this.ceiling!.ceiling_id,
              ceiling:this.facilityCeiling,
              // @ts-ignore
              planning_admin_hierarchy_id:facility[position],
              saved:false,
              budget_class_id:this.ceiling!.ceiling.budget_class_id,
              fund_source_id:this.ceiling!.ceiling.fund_source_id,
              council:ceiling.admin_hierarchy.name,
              facility: '['+facility.code+'] ' + facility.name,
              facilityCode:facility.code,
              is_approved:budgetCeiling==undefined?false:budgetCeiling.is_approved,
              amount:budgetCeiling==undefined?0.00:budgetCeiling.amount,
              is_locked:budgetCeiling==undefined?false:budgetCeiling!.is_locked,
              percent:budgetCeiling==undefined?0.00:((budgetCeiling.amount!)>0?(((budgetCeiling.amount!)/ceiling.amount)*100):0.00)
            }
          });
          this.clonedFacilityCeiling = this.facilityCeiling!.map(c => ({ id: c.id, amount: c.amount,percent:c.percent }));
          this.totalFacilityAllocatedAmount = this.getTotalAllocatedAmount(this.facilityCeiling!);
          this.totalAllocatedCeiling[ceiling?.section?.position] = {...{amount:this.getTotalAllocatedAmount(this.facilityCeiling!)}};
        });
      });
    }
  }
  close():void{
    this.dialogRef.close();
  }

  uploadFacilityCeiling(event:any,overlay:any) {
    const ceilings = this.finalCeilingFromForm();
    if(this.facilityCeilingToUpload.map((a: { amount: any; }) => a.amount).reduce(function(a:any, b:any){return a + b;}) <= this.finalCeiling.amount){
      this.adminHierarchyCeilingService.uploadFinalCeiling(ceilings).subscribe(
        (res: CustomResponse<any>) => {
          if(res.success){
            this.loadFacilityCeiling(this.finalCeiling);
            if(res.data.fail.length > 0){
              this.messageService.clear();
              this.messageService.add({key: 'facility', sticky: true, severity:'info', summary:'Upload Summary', data:res.data.fail});
            }else{
              this.toastService.info(res.message);
            }
            overlay.hide();
          }
        }
      );
    }else{
      this.toastService.error('Total Ceiling Amount Uploaded Should be Less Or Equal To Total Ceiling')
    }
  }

  onSelect(event: any) {
    let workBook:any = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = event.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      if(workBook.SheetNames.length > 0){
        const sheet = workBook.Sheets[workBook.SheetNames[0]];
        this.facilityCeilingToUpload =  XLSX.utils.sheet_to_json(sheet);
      }else{
        this.facilityCeilingToUpload = [];
      }
    }
    reader.readAsBinaryString(file);
  }

  downloadFacilityCeiTemplate(){
    const excelObject = this.mapData(this.facilityCeiling!);
    const excel = this.papa.unparse({ data: excelObject });
    const csvData = new Blob([excel], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    let csvURL = null;
    if (navigator.msSaveBlob) {
      csvURL = navigator.msSaveBlob(csvData, this.finalCeiling.section.name + '_facility_ceiling.xlsx');
    } else {
      csvURL = window.URL.createObjectURL(csvData);
    }
    const tempLink = document.createElement('a');
    // @ts-ignore
    tempLink.href = csvURL;
    tempLink.setAttribute('download', this.finalCeiling.section.name +'_facility_ceiling.xlsx');
    tempLink.click();
  }

  private mapData(data: any[]) {
    return data.map((item) => {
      return {
        id:item.ceilingId,
        CeilingUID:item.ceiling_id,
        AdminHierarchyCeilingUID:this.finalCeiling.id,
        FacilityUID:item.id,
        FundSource:this.finalCeiling.ceiling.fund_source.name,
        BudgetClass:this.finalCeiling.ceiling.budget_class.name,
        FacilityName:item.facility,
        FacilityCode:item.facilityCode,
        amount: item.amount,
      };
    });
  }

  /**
   * Return form values as object of type StrategicPlan
   * @returns StrategicPlan
   */
  protected finalCeilingFromForm(): any {
    const fd = {
      admin_hierarchy_id: this.finalCeiling.admin_hierarchy_id,
      financial_year_id: this.finalCeiling.financial_year_id,
      section_id: this.finalCeiling.section_id,
      admin_hierarchy_ceiling_id: this.finalCeiling.id,
      ceiling_id: this.finalCeiling.ceiling_id,
      budget_type: this.finalCeiling.budget_type,
      budget_class_id:this.finalCeiling?.ceiling?.budget_class_id,
      fund_source_id:this.finalCeiling?.ceiling?.fund_source_id,
      file: this.facilityCeilingToUpload
    };
    return fd;
  }
}
