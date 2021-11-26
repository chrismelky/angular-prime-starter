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
import {User} from "src/app/setup/user/user.model";
import {UserService} from "src/app/setup/user/user.service";

import {UserRole} from "./user-role.model";
import {UserRoleService} from "./user-role.service";
import {UserRoleUpdateComponent} from "./update/user-role-update.component";
import {CreateComponent} from "./create/create.component";

@Component({
  selector: "app-user-role",
  templateUrl: "./user-role.component.html",
})
export class UserRoleComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  userRoles?: UserRole[] = [];
  currentUser!: User;
  roles?: Role[] = [];
  users?: User[] = [];
  user: User | undefined;
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

  constructor(
    protected userRoleService: UserRoleService,
    protected roleService: RoleService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {
    this.user = this.dialogConfig.data.user;
    this.currentUser = this.dialogConfig.data.currentUser;
  }

  ngOnInit(): void {
    this.roleService
      .query({columns: ["id", "name"]})
      .subscribe((resp: CustomResponse<Role[]>) => (this.roles = resp.data));
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
    this.userRoleService
      .query({
        page: pageToLoad,
        per_page: this.perPage,
        user_id: this.user?.id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<UserRole[]>) => {
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

  /**
   * Impletement sorting Set/Reurn the sorting option for data
   * @returns dfefault ot id sorting
   */
  protected sort(): string[] {
    const predicate = this.predicate ? this.predicate : "id";
    const direction = this.ascending ? "asc" : "desc";
    return [`${predicate}:${direction}`];
  }

  create(): void {
    const data = {
      user: this.user
    };
    const ref = this.dialogService.open(CreateComponent, {
      data,
      header: "User - Role Assignment Form",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  edit(row: UserRole): void {
    const data = {
      userRole: row,
      user: this.user
    };
    const ref = this.dialogService.open(UserRoleUpdateComponent, {
      data,
      header: "User - Role Assignment Form",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete UserRole
   * @param userRole
   */
  delete(userRole: UserRole): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this User Role?",
      accept: () => {
        this.userRoleService.delete(userRole.id!).subscribe((resp) => {
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
    resp: CustomResponse<UserRole[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/user"], {
        queryParams: {
          page: this.page,
          per_page: this.perPage,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.userRoles = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading User Role");
  }
}
