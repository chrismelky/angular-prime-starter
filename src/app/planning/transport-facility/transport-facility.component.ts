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
import { AssetCondition } from "src/app/setup/asset-condition/asset-condition.model";
import { AssetConditionService } from "src/app/setup/asset-condition/asset-condition.service";
import { AssetUse } from "src/app/setup/asset-use/asset-use.model";
import { AssetUseService } from "src/app/setup/asset-use/asset-use.service";
import { TransportCategory } from "src/app/setup/transport-category/transport-category.model";
import { TransportCategoryService } from "src/app/setup/transport-category/transport-category.service";

import { TransportFacility } from "./transport-facility.model";
import { TransportFacilityService } from "./transport-facility.service";
import { TransportFacilityUpdateComponent } from "./update/transport-facility-update.component";
import {UserService} from "../../setup/user/user.service";
import {User} from "../../setup/user/user.model";

@Component({
  selector: "app-transport-facility",
  templateUrl: "./transport-facility.component.html",
})
export class TransportFacilityComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  transportFacilities?: TransportFacility[] = [];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  assetConditions?: AssetCondition[] = [];
  assetUses?: AssetUse[] = [];
  transportCategories?: TransportCategory[] = [];

  cols = [
    {
      field: "name",
      header: "Name",
      sort: true,
    },
    {
      field: "registration_number",
      header: "Registration Number",
      sort: false,
    },
    {
      field: "date_of_acquisition",
      header: "Date Of Acquisition",
      sort: true,
    },
    {
      field: "mileage",
      header: "Mileage",
      sort: false,
    },
    {
      field: "type",
      header: "Type",
      sort: true,
    },
    {
      field: "comment",
      header: "Comment",
      sort: false,
    },
    {
      field: "station",
      header: "Station",
      sort: true,
    },
    {
      field: "ownership",
      header: "Ownership",
      sort: true,
    },
    {
      field: "insurance_type",
      header: "Insurance Type",
      sort: true,
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
  currentUser?: User;
  is_current_budget_locked!: boolean;


  //Mandatory filter
  admin_hierarchy_id!: number;
  financial_year_id!: number;

  constructor(
    protected transportFacilityService: TransportFacilityService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected assetConditionService: AssetConditionService,
    protected assetUseService: AssetUseService,
    protected transportCategoryService: TransportCategoryService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected userService: UserService,
    protected toastService: ToastService
  ) {
    this.currentUser = userService.getCurrentUser();
    if (this.currentUser.admin_hierarchy) {
       this.adminHierarchies?.push(this.currentUser.admin_hierarchy);
       this.admin_hierarchy_id = this.currentUser.admin_hierarchy?.id!;
        this.financial_year_id =
        this.currentUser.admin_hierarchy?.current_financial_year_id!;
        this.is_current_budget_locked =
        this.currentUser.admin_hierarchy?.is_current_budget_locked!;
    }
  }

  ngOnInit(): void {
    /*
    this.adminHierarchyService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    */
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.assetConditionService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AssetCondition[]>) =>
          (this.assetConditions = resp.data)
      );
    this.assetUseService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AssetUse[]>) => (this.assetUses = resp.data)
      );
    this.transportCategoryService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<TransportCategory[]>) =>
          (this.transportCategories = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.admin_hierarchy_id || !this.financial_year_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.transportFacilityService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<TransportFacility[]>) => {
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
   * Creating or updating TransportFacility
   * @param transportFacility ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(transportFacility?: TransportFacility): void {
    const data: TransportFacility = transportFacility ?? {
      ...new TransportFacility(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
    };
    const ref = this.dialogService.open(TransportFacilityUpdateComponent, {
      data,
      width:"850px",
      header: "Create/Update TransportFacility",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete TransportFacility
   * @param transportFacility
   */
  delete(transportFacility: TransportFacility): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this TransportFacility?",
      accept: () => {
        this.transportFacilityService
          .delete(transportFacility.id!)
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
    resp: CustomResponse<TransportFacility[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/transport-facility"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.transportFacilities = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Transport Facility");
  }
}
