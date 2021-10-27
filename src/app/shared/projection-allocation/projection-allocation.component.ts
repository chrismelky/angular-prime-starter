import { Component, OnInit } from '@angular/core';
import {AdminHierarchyCeilingService} from "../../budgeting/admin-hierarchy-ceiling/admin-hierarchy-ceiling.service";
import {FinancialYearService} from "../../setup/financial-year/financial-year.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../toast.service";
import {CustomResponse} from "../../utils/custom-response";
import {AdminHierarchyCeiling} from "../../budgeting/admin-hierarchy-ceiling/admin-hierarchy-ceiling.model";

@Component({
  selector: 'app-projection-allocation',
  templateUrl: './projection-allocation.component.html',
  styleUrls: ['./projection-allocation.component.scss']
})
export class ProjectionAllocationComponent implements OnInit {
  private fund_source_id: number;
  private section_id: number;
  private financial_year_id: number;
  private admin_hierarchy_id: number;
  ceiling: AdminHierarchyCeiling []=[];
  private budget_type: string;

  constructor(
    protected adminHierarchyCeilingService: AdminHierarchyCeilingService,
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    private toastService: ToastService,
  ) {
    this.fund_source_id=this.dialogConfig.data.fund_source_id;
    this.section_id = this.dialogConfig.data.section_id;
    this.financial_year_id = this.dialogConfig.data.financial_year_id;
    this.admin_hierarchy_id = this.dialogConfig.data.admin_hierarchy_id;
    this.budget_type = this.dialogConfig.data.budget_type
  }

  ngOnInit(): void {
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
        }
      );
  }

}
