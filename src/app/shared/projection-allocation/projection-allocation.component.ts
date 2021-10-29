import { Component, OnInit } from '@angular/core';
import {AdminHierarchyCeilingService} from "../../budgeting/admin-hierarchy-ceiling/admin-hierarchy-ceiling.service";
import {FinancialYearService} from "../../setup/financial-year/financial-year.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../toast.service";
import {CustomResponse} from "../../utils/custom-response";
import {AdminHierarchyCeiling} from "../../budgeting/admin-hierarchy-ceiling/admin-hierarchy-ceiling.model";
import {FundSourceBudgetClassService} from "../../setup/fund-source-budget-class/fund-source-budget-class.service";
import {Projection} from "../../budgeting/projection/projection.model";
import {ProjectionService} from "../../budgeting/projection/projection.service";

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
  facility_id?: number;
  ceiling: AdminHierarchyCeiling []=[];
  ceilingMapped: any[]=[];
  budget_type: string;
  totalAllocatedAmount: number = 0.00;
  projectionAmount: number = 0.00;

  constructor(
    protected adminHierarchyCeilingService: AdminHierarchyCeilingService,
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    private toastService: ToastService,
    private fundSourceBudgetClassService: FundSourceBudgetClassService,
    protected projectionService: ProjectionService,
  ) {
    this.fund_source_id=this.dialogConfig.data.fund_source_id;
    this.section_id = this.dialogConfig.data.section_id;
    this.financial_year_id = this.dialogConfig.data.financial_year_id;
    this.admin_hierarchy_id = this.dialogConfig.data.admin_hierarchy_id;
    this.budget_type = this.dialogConfig.data.budget_type,
    this.facility_id = this.dialogConfig.data.facility_id
  }

  ngOnInit(): void {
    this.loadData();
    this.loadProjection();
  }

  loadData(): void{
    this.adminHierarchyCeilingService
      .ceilingByFundSource({
        fund_source_id:this.fund_source_id,
        section_id:this.section_id,
        financial_year_id:this.financial_year_id,
        admin_hierarchy_id:this.admin_hierarchy_id,
        budget_type:this.budget_type
      })
      .subscribe(
        (resp: CustomResponse<any>) => {
          this.ceiling = resp.data ?? [];
          this.totalAllocatedAmount = this.getTotalAllocated(this.ceiling);
          this.fundSourceBudgetClassService
            .query({
              fund_source_id:this.fund_source_id,per_page:1000
            })
            .subscribe(
              (resp: CustomResponse<any>) => {
                let budgetClasses = resp.data??[];
                this.ceilingMapped = budgetClasses.map((bc: { budget_class_id: any; id: any; budget_class: any; }) => {
                  const ceiling = this.ceiling!.find(c => c.ceiling.budget_class_id === bc.budget_class_id && c.active === true)
                  return{
                    ceiling_id: bc.id,
                    budget_class:bc.budget_class,
                    amount:ceiling !== undefined?ceiling.amount:0.00,
                    percent:100,
                    is_locked:ceiling !== undefined?ceiling!.is_locked:false,
                  }
                });
              }
            );
        }
      );
  }
  saveAllocation(){

  }
  getTotalAllocated(data:any){
    return data.reduce((total: any, ceiling: any) => (Number(total) + Number(ceiling!.amount)), 0)
  }

  loadProjection():void{
    this.projectionService
      .query({
        per_page: 1000,
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        fund_source_id: this.fund_source_id,
        facility_id:this.facility_id,
      })
      .subscribe(
        (res: CustomResponse<Projection[]>) => {
          let projection = res.data??[];
          this.projectionAmount = this.getTotalAllocated(projection);
        },
      );
  }

}
