import {Component, Input, OnInit} from '@angular/core';
import {CustomResponse} from "../../../utils/custom-response";
import {Sector} from "../../sector/sector.model";
import {SectorService} from "../../sector/sector.service";
import {FundSourceService} from "../../fund-source/fund-source.service";
import {Observable} from "rxjs";
import {FundSourceBudgetClass} from "../fund-source-budget-class.model";
import {finalize} from "rxjs/operators";
import {ToastService} from "../../../shared/toast.service";

@Component({
  selector: 'app-ceinings-sector',
  templateUrl: './ceinings-sector.component.html',
  styleUrls: ['./ceinings-sector.component.scss']
})
export class CeiningsSectorComponent implements OnInit {
  @Input() ceiling_id?: number;
  sectors?: Sector[] = [];
  selectedSectors?: any[] = [];
  selectedCeiling?: any[] = [];
  ceilingSectorStatus:any[] =[];
  constructor(
    protected sectorService: SectorService,
    protected fundSourceService: FundSourceService,
    protected toastService: ToastService
  ) { }

  ngOnInit(): void {
  }
  loadsectors(): void{
    this.sectorService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
      );
    this.getCeilingSectors();
  }

  getCeilingSectors(){
    this.ceilingSectorStatus =[];
    this.fundSourceService
      .queryCeilingSector({ceiling_id:this.ceiling_id,page:1})
      .subscribe(
        (res: CustomResponse<any[]>) => {
          this.selectedCeiling = res?.data ?? [];
          this.selectedSectors = (res?.data ?? [])?.map((sectors: { sector: any; })=>sectors.sector.id);
          let resultSector = this.sectors?.map((x, index) => {
            return {
              'is_active':this.selectedSectors?.includes(x.id)?true:false ,
              'sector_id':x.id,
              'ceiling':res?.data ?? []
            }
          })?? [];
          this.ceilingSectorStatus?.push({sector:resultSector});
          console.log(this.ceilingSectorStatus);
        });
  }

  /**
   * Delete Or Add ceiling Sector
   * @param id
   */
  toggleActivation(sectorId: number,status:any): void{
    if(status == true){
      let payload = {
        sector_id : sectorId,
        ceiling_id : this.ceiling_id
      }
      this.saveCeilingSector(payload);
    }else{
      const ceilingSectorId = this.selectedCeiling?.filter(f => f.sector_id == sectorId)[0].id;
      this.fundSourceService.deleteCeilingSector(ceilingSectorId!).subscribe((resp) => {
        this.toastService.info(resp.message);
        this.loadsectors();
      });
    }
  }

  /**
   * Save new Ceiling sector Mapping
   * @returns
   */
  saveCeilingSector(payload: any): void {
    this.subscribeToSaveResponse(
      this.fundSourceService.createCeilingSector(payload)
    );
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FundSourceBudgetClass>>
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
    this.loadsectors();
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
