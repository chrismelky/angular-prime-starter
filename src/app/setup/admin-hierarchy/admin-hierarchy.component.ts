/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AdminHierarchyLevel } from '../admin-hierarchy-level/admin-hierarchy-level.model';
import { AdminHierarchyUpdateComponent } from './update/admin-hierarchy-update.component';
import { AdminHierarchy } from './admin-hierarchy.model';
import { ToastService } from '../../shared/toast.service';
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from '../../config/pagination.constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HelperService } from '../../utils/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminHierarchyLevelService } from '../admin-hierarchy-level/admin-hierarchy-level.service';
import { Paginator } from 'primeng/paginator';
import { combineLatest } from 'rxjs';
import { DecisionLevelService } from '../decision-level/decision-level.service';
import { CustomResponse } from '../../utils/custom-response';
import { DecisionLevel } from '../decision-level/decision-level.model';
import { AdminHierarchyService } from './admin-hierarchy.service';

@Component({
  selector: 'app-admin-hierarchy',
  templateUrl: './admin-hierarchy.component.html',
})
export class AdminHierarchyComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  adminHierarchies?: AdminHierarchy[] = [];
  title = 'Administration Hierarchies';

  parents?: AdminHierarchy[] = [];
  adminHierarchyPositions?: AdminHierarchyLevel[] = [];
  currentBudgetDecisionLevels?: DecisionLevel[] = [];
  carryoverBudgetDecisionLevels?: DecisionLevel[] = [];
  supplementaryBudgetDecisionLevels?: DecisionLevel[] = [];

  cols = [
    {
      field: 'name',
      header: 'Name',
      sort: true,
    },
    {
      field: 'code',
      header: 'Code',
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

  //Mandatory filter
  parent_id!: number;
  admin_hierarchy_position!: number;

  constructor(
    protected adminHierarchyService: AdminHierarchyService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService,
    protected decisionLevelService: DecisionLevelService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminHierarchyService
      .query()
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) => (this.parents = resp.data)
      );
    this.adminHierarchyLevelService
      .query()
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>
          (this.adminHierarchyPositions = resp.data)
      );
    this.decisionLevelService
      .query()
      .subscribe(
        (resp: CustomResponse<DecisionLevel[]>) =>
          (this.currentBudgetDecisionLevels = resp.data)
      );
    this.decisionLevelService
      .query()
      .subscribe(
        (resp: CustomResponse<DecisionLevel[]>) =>
          (this.carryoverBudgetDecisionLevels = resp.data)
      );
    this.decisionLevelService
      .query()
      .subscribe(
        (resp: CustomResponse<DecisionLevel[]>) =>
          (this.supplementaryBudgetDecisionLevels = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.parent_id || !this.admin_hierarchy_position) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.adminHierarchyService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        parent_id: this.parent_id,
        admin_hierarchy_position: this.admin_hierarchy_position,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<AdminHierarchy[]>) => {
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
   *
   * @param parentAdminHierarchy
   */
  onAdminHierarchySelection(parentAdminHierarchy: AdminHierarchy): void {
    this.parent_id = parentAdminHierarchy.id!;
    this.admin_hierarchy_position =
      parentAdminHierarchy.admin_hierarchy_position! + 1;
    this.filterChanged();
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
   * Creating or updating AdminHierarchy
   * @param adminHierarchy ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(adminHierarchy?: AdminHierarchy): void {
    const data: AdminHierarchy = adminHierarchy ?? {
      ...new AdminHierarchy(),
      parent_id: this.parent_id,
      admin_hierarchy_position: this.admin_hierarchy_position,
    };
    const ref = this.dialogService.open(AdminHierarchyUpdateComponent, {
      data,
      header: 'Create/Update AdminHierarchy',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete AdminHierarchy
   * @param adminHierarchy
   */
  delete(adminHierarchy: AdminHierarchy): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this AdminHierarchy?',
      accept: () => {
        this.adminHierarchyService
          .delete(adminHierarchy.id!)
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
    resp: CustomResponse<AdminHierarchy[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/admin-hierarchy'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.adminHierarchies = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Admin Hierarchy');
  }

  filterParentByLevel(): void {
    let position = this.admin_hierarchy_position;
    if (position === 7) {
      this.title = 'Regions';
    } else if (position === 8) {
      this.title = 'Regions';
    } else if (position === 9) {
      this.title = 'Councils';
    } else if (position === 10) {
      this.title = 'Wards';
    } else {
      this.title = 'Village/Mtaa';
    }
    this.adminHierarchyService
      .query({
        admin_hierarchy_position: position - 1,
        page: 1,
        per_page: 2000,
      })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) => (this.parents = resp.data)
      );
  }
}
