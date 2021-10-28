import { Component, OnInit } from '@angular/core';
import {FundSourceService} from "../../../setup/fund-source/fund-source.service";
import {CustomResponse} from "../../../utils/custom-response";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder} from "@angular/forms";
import {FundSource} from "../../../setup/fund-source/fund-source.model";
import {GfsCodeService} from "../../../setup/gfs-code/gfs-code.service";
import {GfsCode} from "../../../setup/gfs-code/gfs-code.model";
import {ProjectionService} from "../projection.service";

@Component({
  selector: 'app-initiate-projection',
  templateUrl: './initiate-projection.component.html',
  styleUrls: ['./initiate-projection.component.scss']
})
export class InitiateProjectionComponent implements OnInit {

  fund_source_id: number;
  facility_id: number;
  financial_year_id: number;
  admin_hierarchy_id: number;
  projections: any[] = [];
  public revenueSources: any[]= [];
  public selectedRevenueSources: any[]= [];
  public fundSource: FundSource={};
  constructor(
    protected fundSourceService: FundSourceService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    protected fb: FormBuilder,
    protected gfsCodeService: GfsCodeService,
    protected projectionService: ProjectionService
  ) {
    this.fund_source_id=this.config.data.fund_source_id;
    this.facility_id = this.config.data.facility_id;
    this.financial_year_id = this.config.data.financial_year_id;
    this.admin_hierarchy_id = this.config.data.admin_hierarchy_id;
    this.projections = this.config.data.projections;
  }

  ngOnInit(): void {
    this.fundSourceService
      .query({id:this.fund_source_id})
      .subscribe(
        (resp: CustomResponse<FundSource[]>) =>{
          let gfsCode = (resp.data??[])[0].gfs_code!.code;
          this.fundSource = (resp.data??[])[0];
          this.gfsCodeService
            .query({aggregated_code:gfsCode})
            .subscribe(
              (resp: CustomResponse<GfsCode[]>) =>{
                this.revenueSources = resp.data??[];
              }
            );
        }
      );
  }

  initiateProjection():void{
    let payload = {
      financial_year_id : this.financial_year_id,
      admin_hierarchy_id: this.admin_hierarchy_id,
      facility_id:this.facility_id,
      fund_source_id:this.fund_source_id,
      source:this.selectedRevenueSources.map(srs => (srs.id))
    }
    this.projectionService
      .initiate(payload)
      .subscribe(
        (resp: CustomResponse<any[]>) =>{
          console.log(resp);
        }
      );
  }

}
