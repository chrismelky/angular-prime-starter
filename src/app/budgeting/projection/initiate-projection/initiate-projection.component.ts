import { Component, OnInit } from '@angular/core';
import {FundSourceService} from "../../../setup/fund-source/fund-source.service";
import {CustomResponse} from "../../../utils/custom-response";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder} from "@angular/forms";
import {FundSource} from "../../../setup/fund-source/fund-source.model";
import {GfsCodeService} from "../../../setup/gfs-code/gfs-code.service";
import {GfsCode} from "../../../setup/gfs-code/gfs-code.model";
import {ProjectionService} from "../projection.service";
import {Observable} from "rxjs";
import {Projection} from "../projection.model";
import {finalize} from "rxjs/operators";
import {ToastService} from "../../../shared/toast.service";

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
    protected projectionService: ProjectionService,
    protected toastService: ToastService,
  ) {
    this.fund_source_id=this.config.data.fund_source_id;
    this.facility_id = this.config.data.facility_id;
    this.financial_year_id = this.config.data.financial_year_id;
    this.admin_hierarchy_id = this.config.data.admin_hierarchy_id;
    this.projections = this.config.data.projection;
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
                let gfsCodeIds = this.projections.map(p => (p.gfs_code_id));
                console.log(gfsCodeIds);
                this.revenueSources = (resp.data??[]).filter(rs => !this.projections.map(p => (p.gfs_code_id)).includes(rs.id));
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
    this.subscribeToSaveResponse(this.projectionService.initiate(payload));
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Projection>>
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
    this.dialogRef.close(true);
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
