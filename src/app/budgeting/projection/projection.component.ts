/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {combineLatest, Observable} from "rxjs";
import { ConfirmationService, LazyLoadEvent, MenuItem } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { Paginator } from "primeng/paginator";
import { Table } from "primeng/table";

import { CustomResponse } from "../../utils/custom-response";
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "../../config/pagination.constants";
import { HelperService } from "src/app/utils/helper.service";
import { ToastService } from "src/app/shared/toast.service";
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";
import { GfsCode } from "src/app/setup/gfs-code/gfs-code.model";
import { GfsCodeService } from "src/app/setup/gfs-code/gfs-code.service";
import { FundSource } from "src/app/setup/fund-source/fund-source.model";
import { FundSourceService } from "src/app/setup/fund-source/fund-source.service";

import { Projection } from "./projection.model";
import { ProjectionService } from "./projection.service";
import { ProjectionUpdateComponent } from "./update/projection-update.component";
import {UserService} from "../../setup/user/user.service";
import {Section} from "../../setup/section/section.model";
import {User} from "../../setup/user/user.model";
import {FacilityType} from "../../setup/facility-type/facility-type.model";
import {FacilityTypeService} from "../../setup/facility-type/facility-type.service";
import {FacilityService} from "../../setup/facility/facility.service";
import {Facility} from "../../setup/facility/facility.model";
import {AdminCeilingDisseminationComponent} from "../admin-hierarchy-ceiling/update/admin-ceiling-dissemination.component";
import {InitiateProjectionComponent} from "./initiate-projection/initiate-projection.component";
import {AdminHierarchyLevel} from "../../setup/admin-hierarchy-level/admin-hierarchy-level.model";
import {AdminHierarchyLevelService} from "../../setup/admin-hierarchy-level/admin-hierarchy-level.service";
import {ProjectionAllocationComponent} from "../../shared/projection-allocation/projection-allocation.component";
import {finalize} from "rxjs/operators";
import {AdminHierarchyCeilingService} from "../admin-hierarchy-ceiling/admin-hierarchy-ceiling.service";
import {CeilingChainService} from "../../setup/ceiling-chain/ceiling-chain.service";
import {CeilingChain} from "../../setup/ceiling-chain/ceiling-chain.model";

@Component({
  selector: "app-projection",
  templateUrl: "./projection.component.html",
  styleUrls: ['./projection.component.scss']
})
export class ProjectionComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  projections?: Projection[] = [];
  items: MenuItem[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  planningFinancialYears?:any = {};
  gfsCodes?: GfsCode[] = [];
  fundSources?: FundSource[] = [];
  searchKey?: string = '';
  isLoading = false;
  page?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects
  currentUser!: User;
  //Mandatory filter
  facility_id!:number;
  facility_type_id!: number;
  admin_hierarchy_id!: number;
  financial_year_id!: number;
  fund_source_id!: number;
  facilityTypes: FacilityType[] = [];
  facilities: Facility[] =[];
  admin_hierarchy_level_id!: number;
  section_id!:number;
  clonedProjection: { [s: string]: Projection; } = {};
  sectionIds: number[] = [];
  totalProjectionAmount: number = 0.00;
  totalAllocatedAmount: number = 0.00;
  adminHierarchyPosition!:number

  constructor(
    protected projectionService: ProjectionService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected gfsCodeService: GfsCodeService,
    protected fundSourceService: FundSourceService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected userService: UserService,
    protected facilityTypeService: FacilityTypeService,
    protected facilityService: FacilityService,
    protected adminLevelHierarchyService: AdminHierarchyLevelService,
    protected adminHierarchyCeilingService:AdminHierarchyCeilingService,
    protected ceilingChainService: CeilingChainService
  ) {
    this.currentUser = userService.getCurrentUser();
    // this.financial_year_id = this.currentUser?.admin_hierarchy?.current_financial_year_id!;
    this.section_id = this.currentUser?.section_id!;
  }

  ngOnInit(): void {
    this.items = [
      // {label: 'Download Template', icon: 'pi pi-download', command: () => {}},
      // {label: 'Upload Projection', icon: 'pi pi-upload', command: () => {}},
    ];
    this.financialYearService
      .query({ columns: ['id', 'name','status'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>{
          this.financialYears = resp.data ?? [];
          this.financial_year_id = this.financialYears.find(f => (f.status ==1))!.id!;
          if(this.financial_year_id){
            this.financialYearService
              .financialYearAndForward(this.financial_year_id)
              .subscribe(
                (resp: CustomResponse<FinancialYear[]>) =>{
                  this.planningFinancialYears = Object.assign({}, (resp.data??[]));
                }
              );
          }
        }
      );
    this.fundSourceService
      .query({ columns: ["id", "name"],can_project:true })
      .subscribe(
        (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.fund_source_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.projectionService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        fund_source_id: this.fund_source_id,
        facility_id:this.facility_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<any>) => {
          this.isLoading = false;
          this.onSuccess(res, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  /**
   * Called initialy/onInit to
   * Restore page, sort option from url query params if exist and load page
   */
  protected handleNavigation(): void {
    combineLatest([
      this.activatedRoute.data,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([data, params]) => {
      const page = params.get("page");
      const perPage = params.get("per_page");
      const sort = (params.get("sort") ?? data["defaultSort"]).split(":");
      const predicate = sort[0];
      const ascending = sort[1] === "asc";
      this.per_page = perPage !== null ? parseInt(perPage) : ITEMS_PER_PAGE;
      this.page = page !== null ? parseInt(page) : 1;
      if (predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
      }
    });
  }

  /**
   * Mandatory filter field changed;
   * Mandatory filter= fields that must be specified when requesting data
   * @param event
   */
  filterChanged(): void {
    if (this.page !== 1) {
      setTimeout(() => this.paginator.changePage(0));
    } else {
      this.loadPage(1);
    }
  }

  /**
   * search items by @var search params
   */
  onSearch(): void {
    if (this.page !== 1) {
      this.paginator.changePage(0);
    } else {
      this.loadPage();
    }
  }

  /**
   * Clear search params
   */
  clearSearch(): void {
    this.search = {};
    if (this.page !== 1) {
      this.paginator.changePage(0);
    } else {
      this.loadPage();
    }
  }

  /**
   * Sorting changed
   * predicate = column to sort by
   * ascending = sort ascending else descending
   * @param $event
   */
  onSortChange($event: LazyLoadEvent): void {
    if ($event.sortField) {
      this.predicate = $event.sortField!;
      this.ascending = $event.sortOrder === 1;
      this.loadPage();
    }
  }

  /**
   * When page changed
   * @param event page event
   */
  pageChanged(event: any): void {
    this.page = event.page + 1;
    this.per_page = event.rows!;
    this.loadPage();
  }

  /**
   * Impletement sorting Set/Reurn the sorting option for data
   * @returns dfefault ot id sorting
   */
  protected sort(): string[] {
    const predicate = this.predicate ? this.predicate : "id";
    const direction = this.ascending ? "asc" : "desc";
    return [`${predicate}:${direction}`];
  }

  /**
   * Creating or updating Projection
   * @param projection ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(projection?: Projection): void {
    const data: Projection = projection ?? {
      ...new Projection(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      fund_source_id: this.fund_source_id,
    };
    const ref = this.dialogService.open(ProjectionUpdateComponent, {
      data,
      header: "Create/Update Projection",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete Projection
   * @param projection
   */
  delete(projection: Projection): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this Projection?",
      accept: () => {
        this.projectionService.delete(projection.id!).subscribe((resp) => {
          this.loadPage(this.page);
          this.toastService.info(resp.message);
        });
      },
    });
  }

  /**
   * When successfully data loaded
   * @param resp
   * @param page
   * @param navigate
   */
  protected onSuccess(
    resp: CustomResponse<any> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/projection"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.projections = resp?.data ?? [];
    if(this.projections!.length >0){
      this.loadAllocated();
    }
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Projection");
  }

  /**
   *
   * @param event adminhierarchyId or Ids
   */
  onAdminHierarchySelection(event: any): void {
    // this.financial_year_id = event.current_financial_year_id;
    this.adminHierarchyPosition = event.admin_hierarchy_position;
    this.admin_hierarchy_id = event.id;
    this.loadCeilingChain();
    this.adminLevelHierarchyService
      .query({columns: ['id', 'name'],position:event.admin_hierarchy_position})
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>{
          this.admin_hierarchy_level_id = (resp.data??[])[0].id!;
          this.facilityTypeService
            .query({columns: ['id', 'name', 'code'],admin_hierarchy_level_id:this.admin_hierarchy_level_id})
            .subscribe(
              (resp: CustomResponse<FacilityType[]>) =>{
                this.facilityTypes = resp.data??[];
              }
            );
        }
      );
    this.loadPage();
  }

  initiateProjection(): void{
    const ref = this.dialogService.open(InitiateProjectionComponent, {
      header: 'Initiate Projections',
      width: '60%',
      styleClass:'planrep-dialogy',
      data:{
        facility_id:this.facility_id,
        fund_source_id: this.fund_source_id,
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        projection:this.projections
      }
    });
    ref.onClose.subscribe((result) => {
      if(result){
        this.loadPage();
      }
    });
  }
  loadFacilities(){
    this.facilityService
      .query({columns: ['id', 'name', 'code'],facility_type_id:this.facility_type_id,admin_hierarchy_id:this.admin_hierarchy_id})
      .subscribe(
        (resp: CustomResponse<Facility[]>) =>{
          this.facilities = resp.data??[];
        }
      );
  }

  onRowEditInit(projection: Projection) {
    this.clonedProjection[projection.id!] = {...projection};
  }

  onRowEditSave(projection: Projection ,index: number) {
    if(this.projectionValidity(projection).success){
      const index = this.projections!.findIndex(item => item.id === projection.id);
      let amount = (+projection.q1_amount!) + (+projection.q2_amount!) + (+projection.q3_amount!) + (+projection.q4_amount!);
      projection.amount = amount;
      this.projections![index]= projection;
      let payload = this.createFrom(projection)
      if(this.totalAllocatedAmount <= this.getTotalAllocatedProjection(this.projections)){
        this.subscribeToSaveResponse(this.projectionService.update(payload),projection,index);
        this.totalProjectionAmount = this.getTotalAllocatedProjection(this.projections);
      }else{
        this.projections![index] = this.clonedProjection[projection.id!];
        this.toastService.error('Allocated Amount Is Higher than Total Projection Amount');
      }
    }else{
      this.toastService.error(this.projectionValidity(projection).massage);
      this.projections![index] = this.clonedProjection[projection.id!];
    }
  }

  onRowEditCancel(projection: Projection, index: number) {
    this.projections![index] = this.clonedProjection[projection.id!];
    delete this.clonedProjection[projection.id!];
  }

  allocateProjection() : void{
    this.totalProjectionAmount = this.getTotalAllocatedProjection(this.projections);
    if(this.totalProjectionAmount > 0){
      this.ceilingChainService
        .queryWithChild({
          for_admin_hierarchy_level_position:this.adminHierarchyPosition,
          is_active:true,
          per_page:1000,
        })
        .subscribe(
          (resp: CustomResponse<any>) => {
            if((resp.data ?? []).length>0){
              const ref = this.dialogService.open(ProjectionAllocationComponent, {
                header: 'Allocate Ceiling',
                width: '50%',
                data: {
                  fund_source_id: this.fund_source_id,
                  financial_year_id: this.financial_year_id,
                  admin_hierarchy_id: this.admin_hierarchy_id,
                  adminHierarchyPosition:this.adminHierarchyPosition,
                  budget_type: 'CURRENT',
                  section_id: this.section_id,
                  facility_id: this.facility_id,
                  ceilingChain:resp.data[0]
                }
              });
              ref.onClose.subscribe((result) => {
                if(result){
                  this.loadAllocated();
                }
              });
            }else{
              this.toastService.error('No ceiling Chain Configured');
            }
          });
    }else{
      this.toastService.error('Projection Amount Should Be Greater Than 0');
    }
  }

  getTotalAllocated(data:any){
    return data.reduce((total: any, ceiling: any) => (Number(total) + Number(ceiling!.amount)), 0)
  }

  /**
   * Return form values as object of type Projection
   * @returns Projection
   */
  protected createFrom(projection: Projection): Projection {
    let totalAmount = (+projection.q1_amount!) + (+projection.q2_amount!) + (+projection.q4_amount!) + (+projection.q3_amount!);
    return {
      ...new Projection(),
      id: projection.id,
      admin_hierarchy_id: projection.admin_hierarchy_id,
      financial_year_id: projection.financial_year_id,
      gfs_code_id: projection.gfs_code_id,
      fund_source_id: projection.fund_source_id,
      facility_id:projection.facility_id,
      q1_amount: projection.q1_amount,
      q2_amount: projection.q2_amount,
      q3_amount: projection.q3_amount,
      q4_amount: projection.q4_amount,
      amount: totalAmount,
      forwad_year1_amount: projection.forwad_year1_amount,
      forwad_year2_amount: projection.forwad_year2_amount,
    };
  }

  projectionValidity(projection: Projection){
    let existProjection = this.clonedProjection[projection.id!];
    if(
      projection.q1_amount === existProjection.q1_amount &&
      projection.q2_amount === existProjection.q2_amount &&
      projection.q3_amount === existProjection.q3_amount &&
      projection.q4_amount === existProjection.q4_amount &&
      projection.forwad_year1_amount === existProjection.forwad_year1_amount &&
      projection.forwad_year2_amount === existProjection.forwad_year2_amount
    ){
      return {success:false,massage:'No any Change On projection'}
    }else if(
      projection.forwad_year1_amount === 0 ||
      projection.forwad_year2_amount === 0
    ){
      return {success:false,massage:'Forward Projection Is Important'}
    }
    return {success:true,massage:'Every Thing Is ok'}
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Projection>>,
    projection:Projection,
    index:number
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result,projection,index),
      (error) => this.onSaveError(error,projection,index)
    );
  }

  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any,projection:Projection,index:number): void {
    delete this.clonedProjection[projection.id!];
    this.loadPage();
    this.toastService.info(result.message);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any,projection:Projection,index:number): void {
    this.projections![index] = this.clonedProjection[projection.id!];
    this.toastService.error(error.message);
  }

  protected onSaveFinalize(): void {
  }

  calculateTotal(column:string) {
    let total = 0;
    for(let proj of this.projections!) {
      // @ts-ignore
      total += +proj[column];
    }
    return total;
  }


  clear(table: Table) {
    table.clear();
  }

  loadAllocated(){
    this.adminHierarchyCeilingService
      .ceilingByFundSource({
        fund_source_id:this.fund_source_id,
        section_ids:this.sectionIds,
        financial_year_id:this.financial_year_id,
        admin_hierarchy_id:this.admin_hierarchy_id,
        budget_type:'CURRENT'
      })
      .subscribe(
        (resp: CustomResponse<any>) => {
          this.totalAllocatedAmount = this.getTotalAllocated((resp.data ?? []));
          });
  }
  getTotalAllocatedProjection(data:any){
    return data.reduce((total: any, ceiling: any) => (Number(total) + Number(ceiling!.amount)), 0)
  }

  loadCeilingChain(){
    this.ceilingChainService
      .queryWithChild({
        for_admin_hierarchy_level_position:this.adminHierarchyPosition,
        is_active:true,
        per_page:1000,
      })
      .subscribe(
        (resp: CustomResponse<any>) => {
          if((resp.data??[]).length > 0){
            this.sectionIds=resp.data[0].section.map((c: { id: any; }) => (c.id))
          }else{
            this.sectionIds=[];
          }
        });
  }

}
