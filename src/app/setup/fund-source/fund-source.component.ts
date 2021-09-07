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
import { GfsCode } from "src/app/setup/gfs-code/gfs-code.model";
import { GfsCodeService } from "src/app/setup/gfs-code/gfs-code.service";
import { FundSourceCategory } from "src/app/setup/fund-source-category/fund-source-category.model";
import { FundSourceCategoryService } from "src/app/setup/fund-source-category/fund-source-category.service";

import { FundSource } from "./fund-source.model";
import { FundSourceService } from "./fund-source.service";
import { FundSourceUpdateComponent } from "./update/fund-source-update.component";
import {FundSourceGfsCodeList} from "./fund-source-gfs-code-list";

@Component({
  selector: "app-fund-source",
  templateUrl: "./fund-source.component.html",
})
export class FundSourceComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  fundSources?: FundSource[] = [];

  gfsCodes?: GfsCode[] = [];
  fundSourceCategories?: FundSourceCategory[] = [];

  cols = [
    {
      field: "name",
      header: "Name",
      sort: true,
    },
    {
      field: "code",
      header: "Code",
      sort: true,
    },
    // {
    //   field: "is_conditional",
    //   header: "Is Conditional",
    //   sort: false,
    // },
    // {
    //   field: "is_foreign",
    //   header: "Is Foreign",
    //   sort: false,
    // },
    // {
    //   field: "is_treasurer",
    //   header: "Is Treasurer",
    //   sort: false,
    // },
    // {
    //   field: "can_project",
    //   header: "Can Project",
    //   sort: false,
    // },
    // {
    //   field: "is_active",
    //   header: "Is Active",
    //   sort: false,
    // },
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
  gfs_code_id!: number;
  fund_source_category_id!: number;

  constructor(
    protected fundSourceService: FundSourceService,
    protected gfsCodeService: GfsCodeService,
    protected fundSourceCategoryService: FundSourceCategoryService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.gfsCodeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<GfsCode[]>) => (this.gfsCodes = resp.data)
      );
    this.fundSourceCategoryService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundSourceCategory[]>) =>
          (this.fundSourceCategories = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.fund_source_category_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.fundSourceService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        fund_source_category_id: this.fund_source_category_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<FundSource[]>) => {
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
   * Creating or updating FundSource
   * @param fundSource ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(fundSource?: FundSource): void {
    const data: FundSource = fundSource ?? {
      ...new FundSource(),
      gfs_code_id: this.gfs_code_id,
      fund_source_category_id: this.fund_source_category_id,
    };
    const ref = this.dialogService.open(FundSourceUpdateComponent, {
      data,
      header: "Create/Update FundSource",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete FundSource
   * @param fundSource
   */
  delete(fundSource: FundSource): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this FundSource?",
      accept: () => {
        this.fundSourceService.delete(fundSource.id!).subscribe((resp) => {
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
    resp: CustomResponse<FundSource[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/fund-source"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.fundSources = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Fund Source");
  }

  show(row: any,action:any) {
    var header = action=='GfsCode'?('Gfs Codes  for ' +  row.name + '(' + row.code + ')'):('Budget Classes for ' +  row.name + '(' + row.code + ')')
    var witdh =action=='GfsCode'?50:60;
    const ref = this.dialogService.open(FundSourceGfsCodeList, {
      data: {
        fund_source: row,
        action: action
      },
      header: header,
      width: witdh+'%'
    });
  }
}