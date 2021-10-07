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

@Component({
  selector: 'app-admin-ceiling-dissemination',
  templateUrl: './admin-ceiling-dissemination.component.html',
  styleUrls: ['./admin-ceiling-dissemination.component.scss']
})
export class AdminCeilingDisseminationComponent implements OnInit {
  position?: number;
  section_id?: number;
  ceilingStartPosition?:number;
  ceiling?: any=null;
  ceilingChain?: CeilingChain[]=[];
  department?: any[]=[];

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

  }

  ngOnInit(): void {
    this.ceilingChainService
      .query({for_admin_hierarchy_level_position:this.ceilingStartPosition})
      .subscribe(
        (resp: CustomResponse<CeilingChain[]>) =>{
          this.ceilingChain = (resp.data??[]).filter(chain => chain.section_level_position !== 1);
          if(this.ceilingChain!.length > 0){
            for(var chain of this.ceilingChain){
              this.sectionService
                .query({position:chain.section_level_position,page:1,per_page:200})
                .subscribe(
                  (res: CustomResponse<Section[]>) =>{
                    this.department!.push((res.data??[]));
                  }
                );
            }
          }else{
            this.toastService.info("Please Set Ceiling Chain to Proceed ...");
            this.dialogRef.close();
          }
        }
      );
  }

}
