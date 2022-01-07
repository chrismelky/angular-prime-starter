/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {combineLatest} from "rxjs";
import {ConfirmationService, LazyLoadEvent, MenuItem} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {Paginator} from "primeng/paginator";
import {Table} from "primeng/table";

import {CustomResponse} from "../../utils/custom-response";
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "../../config/pagination.constants";
import {HelperService} from "src/app/utils/helper.service";
import {ToastService} from "src/app/shared/toast.service";
import {AccountType} from "src/app/setup/account-type/account-type.model";
import {AccountTypeService} from "src/app/setup/account-type/account-type.service";
import {Category} from "src/app/setup/category/category.model";
import {CategoryService} from "src/app/setup/category/category.service";

import {GfsCode} from "./gfs-code.model";
import {GfsCodeService} from "./gfs-code.service";
import {GfsCodeUpdateComponent} from "./update/gfs-code-update.component";
import {UploadComponent} from "./upload/upload.component";
import {GfsCodeCategory} from "../gfs-code-category/gfs-code-category.model";
import {GfsCodeCategoryService} from "../gfs-code-category/gfs-code-category.service";
import {GfsCodeSectionComponent} from "./gfs-code-section/gfs-code-section.component";
import {saveAs} from "file-saver";

@Component({
  selector: "app-gfs-code",
  templateUrl: "./gfs-code.component.html",
})
export class GfsCodeComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  gfsCodes?: GfsCode[] = [];

  accountTypes?: AccountType[] = [];
  categories?: GfsCodeCategory[] = [];

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
    {
      field: "aggregated_code",
      header: "Aggregated Code",
      sort: true,
    },
    /*{
      field: "is_procurement",
      header: "Procurement",
      sort: false,
    },
    {
      field: "is_protected",
      header: "Protected",
      sort: false,
    },*/
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

  constructor(
    protected gfsCodeService: GfsCodeService,
    protected accountTypeService: AccountTypeService,
    protected categoryService: GfsCodeCategoryService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.accountTypeService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<AccountType[]>) => (this.accountTypes = resp.data)
      );
    this.categoryService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<Category[]>) => (this.categories = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.gfsCodeService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<GfsCode[]>) => {
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
      this.loadPage(this.page, true);
    });
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
   * Creating or updating GfsCode
   * @param gfsCode ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(gfsCode?: GfsCode): void {
    const data: GfsCode = gfsCode ?? {
      ...new GfsCode(),
    };
    const ref = this.dialogService.open(GfsCodeUpdateComponent, {
      data,
      header: "Create/Update GfsCode",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete GfsCode
   * @param gfsCode
   */
  delete(gfsCode: GfsCode): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this GfsCode?",
      accept: () => {
        this.gfsCodeService.delete(gfsCode.id!).subscribe((resp) => {
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
    resp: CustomResponse<GfsCode[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/gfs-code"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.gfsCodes = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Gfs Code");
  }

  upload(): void {
    const ref = this.dialogService.open(UploadComponent, {
      width: '60%',
      header: 'GFS Codes Upload Form'
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  planningUnits(rowData: GfsCode) {
    const ref = this.dialogService.open(GfsCodeSectionComponent, {
      width: '60%',
      header: rowData.code + ' - ' + rowData.name,
      data: {
        gfsCode: rowData
      }
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  download() {
    this.gfsCodeService
      .download()
      .subscribe((response: BlobPart) => {
        saveAs(
          new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          'gfs-codes.xlsx'
        );
      });
  }
}
