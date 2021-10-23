/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
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
import {User} from "src/app/setup/user/user.model";
import {UserService} from "src/app/setup/user/user.service";
import {Group} from "src/app/setup/group/group.model";
import {GroupService} from "src/app/setup/group/group.service";

import {UserGroup} from "./user-group.model";
import {UserGroupService} from "./user-group.service";
import {CreateComponent} from "./create/create.component";

@Component({
  selector: "app-user-group",
  templateUrl: "./user-group.component.html",
})
export class UserGroupComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  userGroups?: UserGroup[] = [];
  group: Group | undefined;
  groups?: Group[] = [];

  cols = []; //Table display columns

  isLoading = false;
  page: number = 1;
  perPage: number = 15;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects

  constructor(
    protected userGroupService: UserGroupService,
    protected userService: UserService,
    protected groupService: GroupService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {
    this.group = this.dialogConfig.data.group;
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.perPage = this.perPage ?? ITEMS_PER_PAGE;
    this.userGroupService
      .query({
        page: pageToLoad,
        per_page: this.perPage,
        group_id: this.group?.id,
        sort: this.sort(),
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<UserGroup[]>) => {
          this.isLoading = false;
          this.onSuccess(res, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  protected handleNavigation(): void {
    const page = this.page;
    const perPage = this.perPage;
    this.perPage = perPage !== null ? perPage : ITEMS_PER_PAGE;
    this.page = page !== null ? page : 1;
    this.loadPage(this.page, true);
  }

  onSearch(): void {
    if (this.page !== 1) {
      this.paginator.changePage(0);
    } else {
      this.loadPage();
    }
  }

  clearSearch(): void {
    this.search = {};
    if (this.page !== 1) {
      this.paginator.changePage(0);
    } else {
      this.loadPage();
    }
  }

  onSortChange($event: LazyLoadEvent): void {
    if ($event.sortField) {
      this.predicate = $event.sortField!;
      this.ascending = $event.sortOrder === 1;
      this.loadPage();
    }
  }

  pageChanged(event: any): void {
    this.page = event.page + 1;
    this.perPage = event.rows!;
    this.loadPage();
  }

  protected sort(): string[] {
    const predicate = this.predicate ? this.predicate : "id";
    const direction = this.ascending ? "asc" : "desc";
    return [`${predicate}:${direction}`];
  }

  create(): void {
    const data = {
      group: this.group
    }
    const ref = this.dialogService.open(CreateComponent, {
      data,
      header: this.group?.name+' User Assignment Form',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  delete(userGroup: UserGroup): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this User Group?",
      accept: () => {
        this.userGroupService.delete(userGroup.id!).subscribe((resp) => {
          this.loadPage(this.page);
          this.toastService.info(resp.message);
        });
      },
    });
  }

  protected onSuccess(
    resp: CustomResponse<UserGroup[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    this.userGroups = resp?.data ?? [];
  }

  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading User Group");
  }
}
