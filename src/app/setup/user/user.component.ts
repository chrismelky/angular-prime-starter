/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {ConfirmationService, LazyLoadEvent, MenuItem} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {Paginator} from 'primeng/paginator';
import {Table} from 'primeng/table';

import {CustomResponse} from '../../utils/custom-response';
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from '../../config/pagination.constants';
import {HelperService} from 'src/app/utils/helper.service';
import {ToastService} from 'src/app/shared/toast.service';
import {Section} from 'src/app/setup/section/section.model';
import {SectionService} from 'src/app/setup/section/section.service';
import {AdminHierarchy} from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import {AdminHierarchyService} from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';

import {User} from './user.model';
import {UserService} from './user.service';
import {UserUpdateComponent} from './update/user-update.component';
import {AdminHierarchyLevelService} from '../admin-hierarchy-level/admin-hierarchy-level.service';
import {AdminHierarchyLevel} from '../admin-hierarchy-level/admin-hierarchy-level.model';
import {UserRoleComponent} from './user-role/user-role.component';

import {finalize} from 'rxjs/operators';
import {UserGroupComponent} from './user-group/user-group.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';

import {AuthService} from "../../core/auth.service";
import {randomString} from "../../shared/helpers";
import {Facility} from "../facility/facility.model";
import {TransferComponent} from "./transfer/transfer.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  levelIsLoading = false;
  users?: User[] = [];
  isSaving = false;
  sections?: Section[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  adminHierarchyLevels?: AdminHierarchyLevel[] = [];
  cols = [
    {
      field: 'first_name',
      header: 'First Name',
      sort: true,
    },
    {
      field: 'last_name',
      header: 'Last Name',
      sort: false,
    },
    {
      field: 'cheque_number',
      header: 'Cheque Number',
      sort: false,
    },
    {
      field: 'username',
      header: 'Username',
      sort: true,
    },
    {
      field: 'title',
      header: 'Title',
      sort: true,
    }
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
  adminHierarchy!: AdminHierarchy;
  admin_hierarchy_position!: number;

  constructor(
    protected userService: UserService,
    protected sectionService: SectionService,
    protected adminHierarchyService: AdminHierarchyService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected authService: AuthService,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {
    this.currentUser = this.authService.getUser();
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
    if (!this.adminHierarchy.id || !this.admin_hierarchy_position) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.userService
      .filterByAdminHierarchyIdAndPosition({
        page: pageToLoad,
        perPage: this.per_page,
        sort: this.sort(),
        parent: `p${this.adminHierarchy.admin_hierarchy_position}`,
        parentId: this.adminHierarchy.id,
        position: this.admin_hierarchy_position,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<User[]>) => {
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
      const page = params.get('page');
      const perPage = params.get('per_page');
      const sort = (params.get('sort') ?? data['defaultSort']).split(':');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
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
    const predicate = this.predicate ? this.predicate : 'id';
    const direction = this.ascending ? 'asc' : 'desc';
    return [`${predicate}:${direction}`];
  }

  /**
   * Creating or updating User
   * @param user ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(user?: User): void {
    const data = {
      user: user || {
        ...new User(),
        admin_hierarchy_id: this.adminHierarchy.id,
        is_super_user: false,
        has_facility_limit: false,
      },
      adminHierarchy: user ? user.admin_hierarchy : this.adminHierarchy,
    };
    const ref = this.dialogService.open(UserUpdateComponent, {
      data,
      width: '900px',
      header: 'Create/Update User',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete User
   * @param user
   */
  delete(user: User): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this User?',
      accept: () => {
        this.userService.delete(user.id!).subscribe((resp) => {
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
    resp: CustomResponse<User[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/user'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            (this.predicate || 'id') + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.users = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading User');
  }

  onAdminHierarchySelection(adminHierarchy: AdminHierarchy): void {
    this.adminHierarchy = adminHierarchy;
    this.loadLowerLevel(this.adminHierarchy.admin_hierarchy_position);
    this.filterChanged();
  }

  loadLowerLevel(position: number | undefined) {
    this.levelIsLoading = true;
    this.adminHierarchyLevelService.lowerLevels(position).subscribe(
      (resp: CustomResponse<AdminHierarchyLevel[]>) => {
        this.adminHierarchyLevels = resp.data;
        this.levelIsLoading = false;
      },
      (error) => (this.levelIsLoading = false)
    );
  }

  roles(rowData: User): void {
    const data = {
      user: rowData,
      currentUser: this.currentUser
    };
    const ref = this.dialogService.open(UserRoleComponent, {
      data,
      width: '60%',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  groups(rowData: User): void {
    const data = {
      user: rowData,
      currentUser: this.currentUser
    };
    const ref = this.dialogService.open(UserGroupComponent, {
      data,
      width: '60%',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }


  toggleActive(user: User, event: any): void {
    this.isSaving = true;
    user.active = event.checked;
    user.username = user.username ? user.username : randomString(16)
    this.subscribeToSaveResponse(this.userService.update(user));
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<User>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
  }

  protected onSaveError(error: any): void {
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  passwordReset(rowData: User): void {
    const data = {
      user: rowData,
    };
    const ref = this.dialogService.open(PasswordResetComponent, {
      data,
      width: '40%',
      header:
        'Password Reset | ' + rowData.first_name + ' ' + rowData.last_name,
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  transfer(rowData: User): void {
    const data = {
      user: rowData,
    };
    const ref = this.dialogService.open(TransferComponent, {
      data,
      width: '60%',
      header: 'User Transfer Form',
    });
    ref.onClose.subscribe((result) => {
      this.loadPage(this.page);
    });
  }
}
