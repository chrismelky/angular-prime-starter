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
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Paginator} from "primeng/paginator";
import {Table} from "primeng/table";

import {CustomResponse} from "../../../utils/custom-response";
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "../../../config/pagination.constants";
import {HelperService} from "src/app/utils/helper.service";
import {ToastService} from "src/app/shared/toast.service";
import {Role} from "src/app/setup/role/role.model";
import {RoleService} from "src/app/setup/role/role.service";
import {Permission} from "src/app/setup/permission/permission.model";
import {PermissionService} from "src/app/setup/permission/permission.service";

import {RolePermission} from "./role-permission.model";
import {RolePermissionService} from "./role-permission.service";
import {RolePermissionUpdateComponent} from "./update/role-permission-update.component";
import {CreateComponent} from "./create/create.component";

@Component({
  selector: "app-role-permission",
  templateUrl: "./role-permission.component.html",
})
export class RolePermissionComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  rolePermissions?: RolePermission[] = [];
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
  role: Role | undefined;

  //Mandatory filter

  constructor(
    protected rolePermissionService: RolePermissionService,
    protected permissionService: PermissionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {
    this.role = this.dialogConfig.data.role;
  }

  ngOnInit(): void {
    this.permissionService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<Permission[]>) => (this.permissions = resp.data)
      );
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
    this.rolePermissionService
      .query({
        page: pageToLoad,
        per_page: this.perPage,
        role_id: this.role?.id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<RolePermission[]>) => {
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
   * Called initially/onInit to
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

  create(): void {
    const data = {
      role: this.role
    };
    const ref = this.dialogService.open(CreateComponent, {
      data,
      header: "Assign Permission",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  edit(rolePermission?: RolePermission): void {
    const data: RolePermission = rolePermission ?? {
      ...new RolePermission(),
      role: this.role,
    };
    const ref = this.dialogService.open(RolePermissionUpdateComponent, {
      data,
      header: "Update Permission Assignment",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete RolePermission
   * @param rolePermission
   */
  delete(rolePermission: RolePermission): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this RolePermission?",
      accept: () => {
        this.rolePermissionService
          .delete(rolePermission.id!)
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
    resp: CustomResponse<RolePermission[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/role"], {
        queryParams: {
          page: this.page,
          per_page: this.perPage,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.rolePermissions = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Role Permission");
  }
}
