/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest } from "rxjs";
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
import { PeSubForm } from "src/app/setup/pe-sub-form/pe-sub-form.model";
import { PeSubFormService } from "src/app/setup/pe-sub-form/pe-sub-form.service";
import { BudgetClass } from "src/app/setup/budget-class/budget-class.model";
import { BudgetClassService } from "src/app/setup/budget-class/budget-class.service";
import { FundSource } from "src/app/setup/fund-source/fund-source.model";
import { FundSourceService } from "src/app/setup/fund-source/fund-source.service";
import { Section } from "src/app/setup/section/section.model";
import { SectionService } from "src/app/setup/section/section.service";

import { PeItem } from "./pe-item.model";
import { PeItemService } from "./pe-item.service";
import { PeItemUpdateComponent } from "./update/pe-item-update.component";
import {UserService} from "../../setup/user/user.service";
import {User} from "../../setup/user/user.model";
import {PeFormService} from "../../setup/pe-form/pe-form.service";
import {FundSourceBudgetClassService} from "../../setup/fund-source-budget-class/fund-source-budget-class.service";
import {FundSourceBudgetClass} from "../../setup/fund-source-budget-class/fund-source-budget-class.model";
import {PeDefinitionService} from "../../setup/pe-definition/pe-definition.service";

@Component({
  selector: "app-pe-item",
  templateUrl: "./pe-item.component.html",
  styleUrls: ['./pe-item.component.scss'],
})
export class PeItemComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  peItems?: PeItem[] = [];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  peSubForms?: any[] = [];
  budgetClasses?: BudgetClass[] = [];
  fundSources?: FundSource[] = [];
  sections?: Section[] = [];
  fetchedFundSources?:FundSource[] = []; // it hold the fund sources fetched from pe forms
  round: any[] = [];
  inputTexts: any[] = [];
  peTableFields:any = [];

  cols = []; //Table display columns

  isLoading = false;
  page?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects

  /* dynamic table values */




  //Mandatory filter
  admin_hierarchy_id!: number;
  financial_year_id!: number;
  pe_sub_form_id!: number;
  budget_class_id!: number;
  fund_source_id!: number;
  section_id!: number;
  pe_form_id!: number;
  currentUser?: User;
  parent_sub_budget_class?:any;

  constructor(
    protected peItemService: PeItemService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected peSubFormService: PeSubFormService,
    protected budgetClassService: BudgetClassService,
    protected fundSourceService: FundSourceService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected userService:UserService,
    protected peFormServices: PeFormService,
    protected fundSourceBudgetClassService: FundSourceBudgetClassService,
    protected peDefinitionService : PeDefinitionService

  ) {
    this.currentUser = userService.getCurrentUser();
    if (this.currentUser.admin_hierarchy) {
      this.adminHierarchies?.push(this.currentUser.admin_hierarchy);
      // @ts-ignore
      this.admin_hierarchy_id = this.adminHierarchies[0].id!;
    }
  }

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.peSubFormService
      .getParentChildren()
      .subscribe(
        (resp: CustomResponse<PeSubForm[]>) => (this.peSubForms = resp.data)
      );
    // this.fundSourceService
    //   .query({ columns: ["id", "name"] })
    //   .subscribe(
    //     (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data)
    //   );
    this.sectionService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
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
      !this.pe_sub_form_id ||
      !this.budget_class_id ||
      !this.fund_source_id ||
      !this.section_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.peItemService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        pe_sub_form_id: this.pe_sub_form_id,
        budget_class_id: this.budget_class_id,
        fund_source_id: this.fund_source_id,
        section_id: this.section_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<PeItem[]>) => {
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
    console.log("PE FORMS")
    console.log("admin_hierarchy_id",this.admin_hierarchy_id);
    console.log("financial_year_id",this.financial_year_id);
    console.log("budget_class_id",this.budget_class_id);
    console.log("fund_source_id",this.fund_source_id);
    console.log("section_id",this.section_id);
    console.log("pe_form_id",this.pe_form_id);

    if (!this.admin_hierarchy_id || !this.financial_year_id || this.budget_class_id <= 0 || this.fund_source_id <= 0 || !this.pe_form_id || !this.section_id) {
     return;
     }
    this.peTableFields = [];
    this.peDefinitionService.getParentChildrenByFormId({"pe_form_id":this.pe_form_id}).subscribe(resp =>{
      let fetchedColumns = resp.data;
      this.peTableFields = resp.data
        console.log("fetchedColumns");
        console.log(fetchedColumns.textInputs);

      if(this.round.length === 0){
        this.addRow(0)
      }
    })


  }

  /**
   * on change pe sub form search Pe Form(parent) by id and Get budget class assigned
   */
  getPeForm(event: any):void{
    if(event.value.length > 0){
      this.budgetClasses! = [];
      this.budget_class_id = 0
      this.fund_source_id = 0
      this.peFormServices.find(event.value[0]?.pe_form_id).subscribe(resp=>{
        this.budgetClasses = resp.data?.budget_classes;
        this.fetchedFundSources = resp.data?.fund_sources;
        this.pe_form_id = event.value[0]?.pe_form_id
        this.filterChanged();
      })
    } else {
      this.budgetClasses = [];
      this.fetchedFundSources = [];
      this.fundSources = [];
    }
  }


  /**
   * on change budget class search fund sources from ceilings
   */
  getFundSources(event: any):void{
   let budgetClassId = event.value;
    this.fund_source_id = 0
    if(this.fetchedFundSources != null || this.fetchedFundSources != undefined){
        this.fundSourceBudgetClassService.getFundSourceByBudgetClass({budget_class_id:budgetClassId,fund_source:JSON.stringify(this.fetchedFundSources)}).subscribe(resp =>{
          this.fundSources = resp.data?.fund_sources;
          this.filterChanged();
        })
    } else {
      this.fundSources = [];
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
   * Creating or updating PeItem
   * @param peItem ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(peItem?: PeItem): void {
    const data: PeItem = peItem ?? {
      ...new PeItem(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      pe_sub_form_id: this.pe_sub_form_id,
      budget_class_id: this.budget_class_id,
      fund_source_id: this.fund_source_id,
      section_id: this.section_id,
    };
    const ref = this.dialogService.open(PeItemUpdateComponent, {
      data,
      header: "Create/Update PeItem",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete PeItem
   * @param peItem
   */
  // delete(peItem: PeItem): void {
  //   this.confirmationService.confirm({
  //     message: "Are you sure that you want to delete this PeItem?",
  //     accept: () => {
  //       this.peItemService.delete(peItem.id!).subscribe((resp) => {
  //         this.loadPage(this.page);
  //         this.toastService.info(resp.message);
  //       });
  //     },
  //   });
  // }

  /**
   * When successfully data loaded
   * @param resp
   * @param page
   * @param navigate
   */
  protected onSuccess(
    resp: CustomResponse<PeItem[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/pe-item"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.peItems = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Pe Item");
  }

  addRow(position:number){

   if(this.peTableFields.textInputs?.length > 0){
     this.inputTexts[position] = this.peTableFields.textInputs;
     this.round.push(position);
   }

  }

  deleteRow(position:number){
    if(position > 1) {
      this.round.pop();
      ///delete Procedure
    }
  }

}
