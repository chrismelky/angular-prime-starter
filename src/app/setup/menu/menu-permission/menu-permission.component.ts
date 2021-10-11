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
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import { Paginator } from "primeng/paginator";
import { Table } from "primeng/table";

import { CustomResponse } from "../../../utils/custom-response";
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "../../../config/pagination.constants";
import { HelperService } from "src/app/utils/helper.service";
import { ToastService } from "src/app/shared/toast.service";
import { Menu } from "src/app/setup/menu/menu.model";
import { MenuService } from "src/app/setup/menu/menu.service";
import { Permission } from "src/app/setup/permission/permission.model";
import { PermissionService } from "src/app/setup/permission/permission.service";

import { MenuPermission } from "./menu-permission.model";
import { MenuPermissionService } from "./menu-permission.service";
import { MenuPermissionUpdateComponent } from "./update/menu-permission-update.component";
import {CreateComponent} from "./create/create.component";

@Component({
  selector: "app-menu-permission",
  templateUrl: "./menu-permission.component.html",
})
export class MenuPermissionComponent implements OnInit {
  menu: Menu | undefined;

  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  menuPermissions?: MenuPermission[] = [];

  menus?: Menu[] = [];
  permissions?: Permission[] = [];

  cols = []; //Table display columns

  isLoading = false;
  page: number = 1;
  perPage: number = 15;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects

  //Mandatory filter
  menu_id!: number;

  constructor(
    protected menuPermissionService: MenuPermissionService,
    protected menuService: MenuService,
    protected permissionService: PermissionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected toastService: ToastService
  ) {
    this.menu = dialogConfig.data.menu;
    this.menu_id = dialogConfig.data.menu.id;
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
    if (!this.menu_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.perPage = this.perPage ?? ITEMS_PER_PAGE;
    this.menuPermissionService
      .query({
        page: pageToLoad,
        per_page: this.perPage,
        sort: this.sort(),
        menu_id: this.menu_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<MenuPermission[]>) => {
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
   * Creating or updating MenuPermission
   * @param menuPermission ; If undefined initialize new model to create else edit existing model
   */
  create(): void {
    const data = {
      menu: this.menu
    }
    const ref = this.dialogService.open(CreateComponent, {
      data,
      header: "Add Permission",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  edit(menuPermission?: MenuPermission): void {
    const data: MenuPermission = menuPermission ?? {
      ...new MenuPermission(),
      menu_id: this.menu_id,
    };
    const ref = this.dialogService.open(MenuPermissionUpdateComponent, {
      data,
      header: "Update MenuPermission",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete MenuPermission
   * @param menuPermission
   */
  delete(menuPermission: MenuPermission): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this MenuPermission?",
      accept: () => {
        this.menuPermissionService
          .delete(menuPermission.id!)
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
    resp: CustomResponse<MenuPermission[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/menu"], {
        queryParams: {
          page: this.page,
          per_page: this.perPage,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.menuPermissions = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Menu Permission");
  }
}
