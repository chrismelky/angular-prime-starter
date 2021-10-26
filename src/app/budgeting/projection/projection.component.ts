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

@Component({
  selector: "app-projection",
  templateUrl: "./projection.component.html",
})
export class ProjectionComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  projections?: Projection[] = [];
  items: MenuItem[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  gfsCodes?: GfsCode[] = [];
  fundSources?: FundSource[] = [];

  cols = [
    {
      field: "gfs_code_id",
      header: "Gfs Code ",
      sort: true,
    },
    {
      field: "active",
      header: "Active",
      sort: false,
    },
    {
      field: "deleted",
      header: "Deleted",
      sort: false,
    },
    {
      field: "q1_amount",
      header: "Q 1 Amount",
      sort: false,
    },
    {
      field: "q2_amount",
      header: "Q 2 Amount",
      sort: false,
    },
    {
      field: "q3_amount",
      header: "Q 3 Amount",
      sort: false,
    },
    {
      field: "q4_amount",
      header: "Q 4 Amount",
      sort: false,
    },
    {
      field: "amount",
      header: "Amount",
      sort: false,
    },
    {
      field: "forwad_year1_amount",
      header: "Forwad Year 1 Amount",
      sort: false,
    },
    {
      field: "forwad_year2_amount",
      header: "Forwad Year 2 Amount",
      sort: false,
    },
    {
      field: "chart_of_account",
      header: "Chart Of Account",
      sort: true,
    },
    {
      field: "export_to",
      header: "Export To",
      sort: true,
    },
    {
      field: "is_sent",
      header: "Is Sent",
      sort: false,
    },
    {
      field: "delivered",
      header: "Delivered",
      sort: false,
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
  currentUser!: User;
  //Mandatory filter
  projection_type_id!: number;
  admin_hierarchy_id!: number;
  financial_year_id!: number;
  fund_source_id!: number;

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
    protected userService: UserService
  ) {
    this.currentUser = userService.getCurrentUser();
    this.financial_year_id = this.currentUser?.admin_hierarchy?.current_financial_year_id!;
  }

  ngOnInit(): void {
    this.items = [
      {label: 'Download Template', icon: 'pi pi-download', command: () => {}},
      {label: 'Upload Projection', icon: 'pi pi-upload', command: () => {}},
    ];
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
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
      !this.projection_type_id ||
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
        projection_type_id: this.projection_type_id,
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        fund_source_id: this.fund_source_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<Projection[]>) => {
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
      projection_type_id: this.projection_type_id,
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
    resp: CustomResponse<Projection[]> | null,
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
    this.admin_hierarchy_id = event.id;
    this.loadPage();
  }

  initiateProjection(): void{

  }
}
