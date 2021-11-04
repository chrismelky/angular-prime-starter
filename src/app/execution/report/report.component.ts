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
import { CasPlanContent } from "src/app/setup/cas-plan-content/cas-plan-content.model";
import { CasPlanContentService } from "src/app/setup/cas-plan-content/cas-plan-content.service";
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";

import {BudgetType, Report} from "./report.model";
import { ReportService } from "./report.service";
import { ReportUpdateComponent } from "./update/report-update.component";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
})
export class ReportComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  reports?: Report[] = [];

  casPlanContents?: CasPlanContent[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];

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
  cas_plan_content_id!: number;
  admin_hierarchy_id!: number;
  financial_year_id!: number;
  // items search objects
  items: MenuItem[] | undefined;
  budgetTypes?: BudgetType[] = [];
  budgetType!: string;
  admin_hierarchy_position!: number;

  constructor(
    protected reportService: ReportService,
    protected casPlanContentService: CasPlanContentService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.budgetTypes = [
      {id:1, name:'CURRENT'},
      {id:2, name:'APPROVED'},
      {id:3, name:'CARRYOVER'},
      {id:4, name:'SUPPLEMENTARY'},
    ];
    this.casPlanContentService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasPlanContent[]>) =>
          (this.casPlanContents = resp.data)
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
    this.items = [
      {
        label: 'PDF Format',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.getReport('PDF');
        },
      },
      {
        label: 'Excel Format',
        icon: 'pi pi-file-excel',
        command: () => {
          this.getReport('XLSX');
        },
      },
    ];
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.cas_plan_content_id ||
      !this.admin_hierarchy_id ||
      !this.financial_year_id||
      !this.budgetType
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.reportService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        cas_plan_content_id: this.cas_plan_content_id,
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<Report[]>) => {
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
   * Creating or updating Report
   * @param report ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(report?: Report): void {
    const data: Report = report ?? {
      ...new Report(),
      cas_plan_content_id: this.cas_plan_content_id,
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
    };
    const ref = this.dialogService.open(ReportUpdateComponent, {
      data,
      header: "Create/Update Report",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete Report
   * @param report
   */
  delete(report: Report): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this Report?",
      accept: () => {
        this.reportService.delete(report.id!).subscribe((resp) => {
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
    resp: CustomResponse<Report[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/report"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.reports = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Report");
  }
  /**
   *
   * @param event adminhierarchyId or Ids
   */
  onAdminHierarchySelection(event: any): void {

    this.admin_hierarchy_id = event.id;
    this.admin_hierarchy_position =event.admin_hierarchy_position;
  }

  private getReport(format: string) {
  if (
    !this.cas_plan_content_id ||
    !this.admin_hierarchy_id ||
    !this.financial_year_id ||
    !this.budgetType){
    return;
  }
  this.reportService.getReport({
    cas_plan_content_id:this.cas_plan_content_id,
    admin_hierarchy_id:this.admin_hierarchy_id,
    financial_year_id:this.financial_year_id,
    budgetType:this.budgetType,
    format:format
  }).subscribe((resp)=>{
    console.log(resp.data);
  });
  }
}
