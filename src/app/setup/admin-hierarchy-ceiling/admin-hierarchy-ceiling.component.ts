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
import { EnumService, PlanrepEnum } from "src/app/shared/enum.service";
import { FundSourceBudgetClass } from "src/app/setup/fund-source-budget-class/fund-source-budget-class.model";
import { FundSourceBudgetClassService } from "src/app/setup/fund-source-budget-class/fund-source-budget-class.service";
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";
import { Section } from "src/app/setup/section/section.model";
import { SectionService } from "src/app/setup/section/section.service";

import { AdminHierarchyCeiling } from "./admin-hierarchy-ceiling.model";
import { AdminHierarchyCeilingService } from "./admin-hierarchy-ceiling.service";
import { AdminHierarchyCeilingUpdateComponent } from "./update/admin-hierarchy-ceiling-update.component";
import {InitiateCeilingComponent} from "./update/initiate-ceiling.component";
import {SectionLevelService} from "../section-level/section-level.service";
import {SectionLevel} from "../section-level/section-level.model";

@Component({
  selector: "app-admin-hierarchy-ceiling",
  templateUrl: "./admin-hierarchy-ceiling.component.html",
})
export class AdminHierarchyCeilingComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  adminHierarchyCeilings?: AdminHierarchyCeiling[] = [];

  ceilings?: FundSourceBudgetClass[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  parents?: AdminHierarchyCeiling[] = [];
  sections?: Section[] = [];
  planingLevels?: SectionLevel[] = [];
  budgetTypes?: PlanrepEnum[] = [];

  cols = [
    {
      field: "ceiling_id",
      header: "Ceiling ",
      sort: true,
    },
    {
      field: "parent_id",
      header: "Parent ",
      sort: true,
    },
    {
      field: "section_id",
      header: "Section ",
      sort: true,
    },
    {
      field: "active",
      header: "Active",
      sort: false,
    },
    {
      field: "is_locked",
      header: "Is Locked",
      sort: false,
    },
    {
      field: "is_approved",
      header: "Is Approved",
      sort: false,
    },
    {
      field: "amount",
      header: "Amount",
      sort: true,
    },
    {
      field: "deleted",
      header: "Deleted",
      sort: false,
    },
  ]; //Table display columns

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
  budget_type!: string;
  position: number=1;
  section_id!:number;
  admin_hierarchy_position!:number;

  constructor(
    protected adminHierarchyCeilingService: AdminHierarchyCeilingService,
    protected ceilingService: FundSourceBudgetClassService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected parentService: AdminHierarchyService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected enumService: EnumService,
    protected sectionLevelService: SectionLevelService,
  ) {}

  ngOnInit(): void {
    this.ceilingService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundSourceBudgetClass[]>) => (this.ceilings = resp.data)
      );
    this.sectionLevelService
      .query({ columns: ["id", "name","position"] })
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) => (this.planingLevels = resp.data)
      );
    this.adminHierarchyService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.parentService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchyCeiling[]>) => (this.parents = resp.data)
      );
    this.budgetTypes = this.enumService.get("budgetTypes");
    this.handleNavigation();
  }

  selectionLevelChange(){
    this.sectionService
      .query({ position :this.position})
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
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
      !this.budget_type ||
      !this.position
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.adminHierarchyCeilingService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        budget_type: this.budget_type,
        position:this.position,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<AdminHierarchyCeiling[]>) => {
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
   * Creating or updating AdminHierarchyCeiling
   * @param adminHierarchyCeiling ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(adminHierarchyCeiling?: AdminHierarchyCeiling): void {
    const data: AdminHierarchyCeiling = adminHierarchyCeiling ?? {
      ...new AdminHierarchyCeiling(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      budget_type: this.budget_type,
    };
    const ref = this.dialogService.open(AdminHierarchyCeilingUpdateComponent, {
      data,
      header: "Create/Update AdminHierarchyCeiling",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete AdminHierarchyCeiling
   * @param adminHierarchyCeiling
   */
  delete(adminHierarchyCeiling: AdminHierarchyCeiling): void {
    this.confirmationService.confirm({
      message:
        "Are you sure that you want to delete this AdminHierarchyCeiling?",
      accept: () => {
        this.adminHierarchyCeilingService
          .delete(adminHierarchyCeiling.id!)
          .subscribe((resp) => {
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
    resp: CustomResponse<AdminHierarchyCeiling[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/admin-hierarchy-ceiling"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.adminHierarchyCeilings = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Admin Hierarchy Ceiling");
  }

  /**
   *
   * @param event adminhierarchyId or Ids
   */
  onAdminHierarchySelection(event: any): void {
    this.admin_hierarchy_id = event.id;
    this.admin_hierarchy_position =event.admin_hierarchy_position;
  }

  /**
   * Creating or updating AdminHierarchyCeiling
   * @param adminHierarchyCeiling ; If undefined initize new model to create else edit existing model
   */
  initiateCeiling(): void {
    const ref = this.dialogService.open(InitiateCeilingComponent, {
      header: "Ceiling Dissemination",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Lock or unlock AdminHierarchyCeiling
   * @param adminHierarchyCeiling ;
   */
  lock(action: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to ' + (action===0?'Lock All Levels':'UnLock All Levels'),
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

      },
      reject: (type:any) => {

      }
    });
  }
}
