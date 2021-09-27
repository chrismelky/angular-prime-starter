import {Component, Input, OnInit} from '@angular/core';
import {CustomResponse} from "../../../utils/custom-response";
import {FacilityType} from "../../facility-type/facility-type.model";
import {FacilityTypeService} from "../../facility-type/facility-type.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ToastService} from "../../../shared/toast.service";
import {FundSourceBudgetClassService} from "../fund-source-budget-class.service";
import {Observable} from "rxjs";
import {FundSourceBudgetClass} from "../fund-source-budget-class.model";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-ceiling-facility-type',
  templateUrl: './ceiling-facility-type.component.html',
  styleUrls: ['./ceiling-facility-type.component.scss']
})
export class CeilingFacilityTypeComponent implements OnInit {
  @Input() ceiling?: any;
  defaultFacilityTypes: FacilityType[] =[];
  facilityTypes?: FacilityType[] = [];
  selectedFacilityTypes: FacilityType[] = [];
  facilityTypeForm = this.fb.group({
    id:[null,[Validators.required]],
    facilityTypes: [null,[Validators.required]],
  });

  constructor(
    private facilityTypeService: FacilityTypeService,
    protected fb: FormBuilder,
    protected toastService: ToastService,
    protected fundSourceBudgetClassService: FundSourceBudgetClassService,
  ) { }

  ngOnInit(): void {

  }

  saveFacilityTypes(): void{
    let facilityTypes =this.selectedFacilityTypes.concat(this.defaultFacilityTypes);
    const form = this.createFromForm(this.ceiling,facilityTypes);
    this.subscribeToSaveResponse(
      this.fundSourceBudgetClassService.update(form),facilityTypes
    );
  }

  delete(row:any): void{
    let newFacilityTypes= this.defaultFacilityTypes.filter(facilityType => facilityType.id !== row.id);
    const form = this.createFromForm(this.ceiling,newFacilityTypes);
    this.subscribeToSaveResponse(
      this.fundSourceBudgetClassService.update(form),newFacilityTypes
    );
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FundSourceBudgetClass>>,
    facilityTypes:any
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result,facilityTypes),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any,facilityTypes: any): void {
    this.toastService.info(result.message);
    this.defaultFacilityTypes = facilityTypes;
    this.facilityTypeService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<FacilityType[]>) =>{
          this.facilityTypes = resp.data
          this.facilityTypes = this.facilityTypes?.filter(facilityType => this.defaultFacilityTypes.every(d => d.id !== facilityType.id));
        }
      );
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
  }

  loadFacilityTypes() : void{
    this.defaultFacilityTypes = this.ceiling.facility_types;
    this.facilityTypeService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<FacilityType[]>) =>{
          this.facilityTypes = resp.data
          this.facilityTypes = this.facilityTypes?.filter(facilityType => this.defaultFacilityTypes.every(d => d.id !== facilityType.id));
        }
      );
  }

  /**
   * Return form values as object of type FundSourceBudgetClass
   * @returns FundSourceBudgetClass
   */
  protected createFromForm(ceiling: any,facilityTypes: any): FundSourceBudgetClass {
    return {
      ...new FundSourceBudgetClass(),
      id: ceiling.id,
      ceiling_name:  ceiling.ceiling_name,
      budget_class_id:  ceiling.budget_class_id,
      fund_source_id: ceiling.fund_source_id,
      facility_types: facilityTypes,
    };
  }
}
