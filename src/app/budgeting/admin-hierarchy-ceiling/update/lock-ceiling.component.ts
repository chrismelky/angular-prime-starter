import { Component, OnInit } from '@angular/core';
import {CustomResponse} from "../../../utils/custom-response";
import {Sector} from "../../../setup/sector/sector.model";
import {FormBuilder, Validators} from "@angular/forms";
import {BudgetClassService} from "../../../setup/budget-class/budget-class.service";
import {FundSourceBudgetClassService} from "../../../setup/fund-source-budget-class/fund-source-budget-class.service";
import {ToastService} from "../../../shared/toast.service";
import {SectorService} from "../../../setup/sector/sector.service";
import {FundSourceService} from "../../../setup/fund-source/fund-source.service";
import {SelectItemGroup} from "primeng/api";
import {FundSource} from "../../../setup/fund-source/fund-source.model";
import {AdminHierarchyLevel} from "../../../setup/admin-hierarchy-level/admin-hierarchy-level.model";
import {AdminHierarchyService} from "../../../setup/admin-hierarchy/admin-hierarchy.service";
import {AdminHierarchyLevelService} from "../../../setup/admin-hierarchy-level/admin-hierarchy-level.service";
import {CeilingChainService} from "../../../setup/ceiling-chain/ceiling-chain.service";
import {SectionLevel} from "../../../setup/section-level/section-level.model";
import {AdminHierarchy} from "../../../setup/admin-hierarchy/admin-hierarchy.model";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {AdminHierarchyCeilingService} from "../admin-hierarchy-ceiling.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AdminHierarchyCeiling} from "../admin-hierarchy-ceiling.model";
import {UserService} from "../../../setup/user/user.service";
import {User} from "../../../setup/user/user.model";

@Component({
  selector: 'app-lock-ceiling',
  templateUrl: './lock-ceiling.component.html',
  styleUrls: ['./lock-ceiling.component.scss']
})
export class LockCeilingComponent implements OnInit {
  budgetClasses?: SelectItemGroup[];
  fundSources?: FundSource[] = [];
  sectors?: Sector[] = [];
  adminHierarchyPositions?: AdminHierarchyLevel[] = [];
  sectionPositions?: SectionLevel[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  ceilingLockStatus?: any[] = [];
  sectionLevelStatus?: any[] = [];
  currentUser!: User;
  lockCeilingForm = this.fb.group({
    fund_sources: [null, []],
    budget_classes: [null, []],
    admin_hierarchies:[null, [Validators.required]],
    admin_hierarchy_position:[null,[Validators.required]],
    section_position:[null,[]],
    budget_type:[null,[]],
    financial_year_id:[null,[]],
    action:[null,[]]
  });
  constructor(
    protected fb: FormBuilder,
    private budgetClassService: BudgetClassService,
    private toastService: ToastService,
    protected sectorService: SectorService,
    protected fundSourceService: FundSourceService,
    protected adminHierarchyService: AdminHierarchyService,
    protected ceilingChainService: CeilingChainService,
    protected adminHierarchyCeilingService: AdminHierarchyCeilingService,
    protected userService : UserService,
    public config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef,
  ) {
    this.currentUser = userService.getCurrentUser();
    console.log(this.currentUser)
  }

  ngOnInit(): void {
    this.budgetClassService.getParentChild().subscribe(
      (resp: CustomResponse<any[]>) => (this.budgetClasses = resp.data));
    this.fundSourceService.query({columns:['id','name','code'],is_active:true}).subscribe(
      (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data));
    this.ceilingChainService
      .ceilingHierarchyLevels()
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>
          (this.adminHierarchyPositions = resp.data)
      );
    this.ceilingChainService
      .ceilingSectionLevels()
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) =>{
          this.sectionPositions = resp.data;
          this.sectionPositions?.push({'id':0,'position':0,'name':'All'});
        }
      );
    this.updateForm(this.config.data);
    this.loadAdminHierarchies(this.config.data.admin_hierarchy_position);
  }

  close():void{
    this.dialogRef.close();
  }
  save():void{

  }
  lockCeiling(): void{

  }

  getAdminHierarchyByPosition(position:number){
    this.adminHierarchyService.queryByPositionAndParent(
      {
        position:position,
        parent: `p${this.currentUser.admin_hierarchy?.admin_hierarchy_position}`,
        parentId: this.currentUser.admin_hierarchy?.id

      }).subscribe(
      (resp: CustomResponse<AdminHierarchy[]>) =>{
        this.adminHierarchies = resp.data;
        this.ceilingLockStatus = this.adminHierarchies?.filter((a:any)=>{ if(this.lockCeilingForm.get('admin_hierarchies')?.value.includes(a.id)){return a} });
      });
  }

  onTabOpen(index: number){
    var adminHierarchyId = this.ceilingLockStatus![index].id;
    this.adminHierarchyCeilingService.getCeilingLockUnlockSummary(
      {admin_hierarchy_id:adminHierarchyId,
        financial_year_id:this.config.data.financial_year_id,
        budget_type:this.config.data.budget_type})
      .subscribe(
      (resp: CustomResponse<any[]>) =>{
        this.sectionLevelStatus = resp.data;
      });
  }

  getAdminHierarchies(ids: any): void{
    this.ceilingLockStatus = this.adminHierarchies?.filter((a:any)=>{ if(ids.includes(a.id)){return a} });
  }

  loadAdminHierarchies(event:any){
    this.getAdminHierarchyByPosition(event);
  }

  /**
   * Lock unlock ceiling
   */
  lock(action: boolean): void {
    this.lockCeilingForm.get('action')?.setValue(action);
    this.subscribeToSaveResponse(
      this.adminHierarchyCeilingService.lockOrUnlockCeiling(this.lockCeilingForm.value)
    );
  }
  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<any>>
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
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
  }
  /**
   * Set/Initialize form values
   * @param
   */
  protected updateForm(data: any): void {
    this.lockCeilingForm.patchValue({
      admin_hierarchies:[data.admin_hierarchy_id],
      admin_hierarchy_position:data.admin_hierarchy_position,
      financial_year_id:data.financial_year_id,
      budget_type:data.budget_type,
      section_position:data.position,
      fund_sources: [],
      budget_classes: [],
    });
  }
}
