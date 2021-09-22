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
import {isNumeric} from "rxjs/internal-compatibility";

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

  /* dynamic table values */
  round: any[] = [];
  inputTexts: any[] = [];
  peTableFields:any = [];
  peDataValues:any = [];
  verticalTotal:any = {};

  peValuesArray: any = {};
  dataReady= false;

  cols = []; //Table display columns
  isLoading = false;
  page?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects





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

    this.sectionService.departmentCostCenter().subscribe(resp =>{
      this.sections = resp.data
    })
    /*
    this.sectionService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    */
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

    if (!this.admin_hierarchy_id || !this.financial_year_id || this.budget_class_id <= 0 || this.fund_source_id <= 0 || !this.pe_form_id || !this.section_id) {
     return;
     }
    this.peTableFields = [];
    this.peDefinitionService.getParentChildrenByFormId({"pe_form_id":this.pe_form_id,"pe_sub_form_id":this.pe_sub_form_id}).subscribe(resp =>{
      this.peTableFields = resp.data;
      //this.verticalTotal =resp.data?.textInputs;
      if(this.round.length === 0){
        this.addRow(0)
        this.preparation()
      } else {
          for(let i = this.round.length; i > 1; i-- ){
            this.inputTexts[i] = [];
            this.round.pop();
          }
          this.round.pop();
          this.addRow(0)
        this.preparation()
      }
    })

  }

  /**
   * on change pe sub form search Pe Form(parent) by id and Get budget class assigned
   */
  getPeForm(event: any):void{
   // console.log(event.value?.id)
    if(event.value?.id >= 1){
      this.budgetClasses! = [];
      this.budget_class_id = 0
      this.fund_source_id = 0
      this.pe_sub_form_id = event.value?.id;
      this.peFormServices.find(event.value?.pe_form_id).subscribe(resp=>{
        this.budgetClasses = resp.data?.budget_classes;
        this.fetchedFundSources = resp.data?.fund_sources;
        this.pe_form_id = event.value?.pe_form_id
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


  /**
   * Delete PeItem
   * @param peItem
   */
  delete(position:number): void {
    this.confirmationService.confirm({
      message: "Do you want to remove the last row?",
        accept: () => {
          this.deleteRow(position);
        }
    })
  }

  /*
   function used when new row added
   */
  addRow(position:number){
   if(this.peTableFields.textInputs?.length > 0 && this.isCriteriaMeet() && this.pe_sub_form_id){
     this.inputTexts[position] = this.peTableFields.textInputs;

     //create object of round
     let roundObject:any = {}
     roundObject.id =position
     roundObject.uid = `${this.getRoundUniqueId()}-${position}` // get unique uid
     this.modifyPayload(this.inputTexts[position],`${this.getRoundUniqueId()}-${position}`,position); //format payload
     this.round.push(roundObject);
   }

   /* call all prepare array of each input*/
    this.preparation()
  }


  /*
   Each row added format individual textInput  and Create payload
   then add mandatory fields as attributes
   then push to peDataValues ready for receiving input value
   */
  modifyPayload(payloads:any,uid:any,roundId:number){
    payloads?.forEach((r:any) => {
      let object:any = {
        ...r,
        uid :uid,
        roundId:roundId,
        /*
        admin_hierarchy_id : this.admin_hierarchy_id,
        financial_year_id : this.financial_year_id,
        section_id : this.section_id,
        budget_class_id : this.budget_class_id,
        fund_source_id : this.fund_source_id,
        pe_form_id : this.pe_form_id,
        pe_sub_form_id : this.pe_sub_form_id
        */
      }
       this.peDataValues.push(object);
    })
  }



  /*Function for deleting rows where id greater than one */
  deleteRow(position:number){
    if(position > 1) {
      this.round.pop();

      /*then remove arrays of all fields */
      this.peTableFields.textInputs?.forEach((value:any)=>{
        this.peDataValues.pop();
      })
    }
  }


 /*
 * This function check if all mandatory field selected, return true if selected, false if nor*/
  isCriteriaMeet(){
    if (!this.admin_hierarchy_id || !this.financial_year_id || this.budget_class_id <= 0 || this.fund_source_id <= 0 || !this.pe_form_id || !this.section_id) {
      return false;
    } else {
      return true;
    }
  }

  store(){
   // console.log(this.peValuesArray)
   //  console.log(this.peDataValues)
      const object:any = {
       dataValues:this.peDataValues,
      admin_hierarchy_id : this.admin_hierarchy_id,
      financial_year_id : this.financial_year_id,
      section_id : this.section_id,
      budget_class_id : this.budget_class_id,
      fund_source_id : this.fund_source_id,
      pe_form_id : this.pe_form_id,
      pe_sub_form_id : this.pe_sub_form_id
    }

    this.peItemService.create(object).subscribe(response =>{
      console.log("response")
    })
  }

  updateValue(data:any){
    if(data?.value !== undefined) {
      const objectIndex = this.peDataValues?.findIndex((pdv: any) => {
        return (
          pdv.uid === data.uid &&
          pdv.id === data.id
        );
      })
      this.peDataValues[objectIndex].value = data.value ? data.value : "";
      //select_option
      delete this.peDataValues[objectIndex]?.select_option;
      this.horizontalTotal(data); // per column parent

      // if row number is greater than one
      if (this.round.length > 1) {
        this.getVerticalTotal(data); // last row
      }
    }
  }

  /* sam vertical total */
  getVerticalTotal(data:any) {
    if (data.type === "number" || data.output_type ==="CURRENCY") {
      const filtered = this.peDataValues?.filter((value: any) => value.id === data.id)
      var verticalTotal = 0;
      filtered?.forEach((fValue: any) => {
        let value = parseFloat(fValue?.value) ? parseFloat(fValue?.value): 0;
        verticalTotal = verticalTotal + value;
      })
      this.verticalTotal[data.id!] = verticalTotal.toFixed(2)
    }
  }

  /* get vertical for horizontal total */
  getSamVerticalTotal(data:any){
    const columnTotals = this.peDataValues?.filter((value: any) => value.id === data.id);
    var total = 0;
    columnTotals.forEach((tcolum:any)=>{
       let value = isNumeric(tcolum?.value) === true ? parseFloat(tcolum?.value): 0;
       total = total + value;
    })
    this.verticalTotal[data.id!] = total.toFixed(2)
  }


  /* sam vertical total */
  horizontalTotal(data:any){
    if(data.output_type ==="CURRENCY" || data.type === "number"){
      /* filter  to find columns than contain totals*/
        const columnTotals = this.peDataValues?.filter((value: any) => value.parent_id === data.parent_id && value.uid === data.uid && (value.formula !== null && value.formula !== ""));
        columnTotals.forEach((tcolum:any)=>{

          /* get vertical for horizontal total */
          var formula = tcolum.formula;
          let columnArrays = formula.split(/[.\*+-/_]/);
          columnArrays.forEach((column:any)=>{

          // find all columns
          const filtered = this.peDataValues?.filter((value: any) => value.parent_id === data.parent_id && value.column_number === column && value.uid === data.uid)
         // let dataValue = filtered[0]?.value ? filtered[0]?.value : 0;
          let dataValue = isNumeric(filtered[0]?.value) === true ? parseFloat(filtered[0]?.value): 0;
            formula = formula.replace(column, dataValue);
        })

          //find the index of object and update value key
          const objectIndex = this.peDataValues?.findIndex((pdv:any) => {
            return (
              pdv.uid === tcolum.uid &&
              pdv.id === tcolum.id
            );
          })

          let calculatedValue = isNumeric(eval(formula)) === true ? parseFloat(eval(formula)): 0;
          this.peDataValues[objectIndex].value = calculatedValue.toFixed(2);
          this.peValuesArray[tcolum.uid!][tcolum.id].value = calculatedValue.toFixed(2)

          // if row number is greater than one
          if(this.round.length > 1) {
            this.getSamVerticalTotal(tcolum)
          }
      })
    }
  }

  /* prepare payload arrays and bind to roundId and InputIds to each textInput */
  preparation(){
    this.round?.forEach((r) => {
     this.peValuesArray[r.uid] = {}
      this.peTableFields.textInputs?.forEach((f:any) => {
        const exist = this.peDataValues?.find((pdv:any) => {
          return (
            pdv.uid === r.uid &&
            pdv.id === f.id
          );
        });

        this.peValuesArray[r.uid][f.id]={
          ...exist?exist:undefined
        };
      })
    });
    this.dataReady = true
  }

  /* generate round/table row unique Id id added
  * The id is based on
  * FinancialYearId, adminHierarchyId, sectionId/CostCenterId,peFormId,peSubFormId,budgetClass,fundSource and serialNumber*/
  getRoundUniqueId(){
    let currentDate=new Date(); // 2020-04-17T17:19:19.831Z
   // return `${this.financial_year_id}-${this.admin_hierarchy_id}-${this.section_id}-${this.pe_form_id}-${this.pe_sub_form_id}-${this.budget_class_id}-${this.fund_source_id}`
    return `${this.financial_year_id}-${this.admin_hierarchy_id}-${this.section_id}-${this.pe_form_id}-${this.pe_sub_form_id}-${currentDate.getTime()}`
  }

}
