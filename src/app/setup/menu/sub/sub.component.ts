import {Component, OnInit, ViewChild} from '@angular/core';
import {Menu} from "../menu.model";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ITEMS_PER_PAGE, PER_PAGE_OPTIONS} from "../../../config/pagination.constants";
import {CustomResponse} from "../../../utils/custom-response";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {Paginator} from "primeng/paginator";
import {Table} from "primeng/table";
import {MenuService} from "../menu.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HelperService} from "../../../utils/helper.service";
import {ToastService} from "../../../shared/toast.service";
import {MenuUpdateComponent} from "../update/menu-update.component";
import {MenuPermissionComponent} from "../menu-permission/menu-permission.component";

@Component({
  selector: 'app-sub',
  templateUrl: './sub.component.html',
  styleUrls: ['./sub.component.scss']
})
export class SubComponent implements OnInit {
  menu: Menu | undefined;
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  menus?: Menu[] = [];

  parents?: Menu[] = [];

  cols = [
    {
      field: "label",
      header: "Label",
      sort: true,
    },
    {
      field: "icon",
      header: "Icon",
      sort: true,
    },
    {
      field: "separator",
      header: "Separator",
      sort: false,
    },
    {
      field: "router_link",
      header: "Router Link",
      sort: true,
    },
    {
      field: "sort_order",
      header: "Sort Order",
      sort: true,
    },
  ]; //Table display columns

  isLoading = false;
  page: number = 1;
  perPage: number = 15;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects

  //Mandatory filter

  constructor(
    protected menuService: MenuService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected toastService: ToastService
  ) {
    this.menu = this.dialogConfig.data.menu;
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.perPage = this.perPage ?? ITEMS_PER_PAGE;
    this.menuService
      .query({
        page: pageToLoad,
        per_page: this.perPage,
        parent_id: this.menu?.id,
        sort: this.sort(),
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<Menu[]>) => {
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
    const page = this.page;
    const perPage = this.perPage;
    this.perPage = perPage !== null ? perPage : ITEMS_PER_PAGE;
    this.page = page !== null ? page : 1;
    this.loadPage(this.page, true);
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
    this.perPage = event.rows!;
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
   * Creating or updating Menu
   * @param menu ; If undefined initialize new model to create else edit existing model
   */
  createOrUpdate(menu?: Menu): void {
    const data: Menu = menu ?? {
      ...new Menu(),
    };
    const ref = this.dialogService.open(MenuUpdateComponent, {
      data,
      header: "Create/Update Menu",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete Menu
   * @param menu
   */
  delete(menu: Menu): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this Menu?",
      accept: () => {
        this.menuService.delete(menu.id!).subscribe((resp) => {
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
    resp: CustomResponse<Menu[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    this.menus = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Menu");
  }

  permissions(rowData: Menu): void {
    const data = {
      menu: rowData
    }
    const ref = this.dialogService.open(MenuPermissionComponent, {
      data,
      width: '60%',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }
}
