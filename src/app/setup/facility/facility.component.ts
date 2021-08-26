/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MenuItem,
  TreeNode,
} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

import { CustomResponse } from '../../utils/custom-response';
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from '../../config/pagination.constants';
import { HelperService } from 'src/app/utils/helper.service';
import { ToastService } from 'src/app/shared/toast.service';
import { EnumService, PlanrepEnum } from 'src/app/shared/enum.service';
import { FacilityType } from 'src/app/setup/facility-type/facility-type.model';
import { FacilityTypeService } from 'src/app/setup/facility-type/facility-type.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';

import { Facility } from './facility.model';
import { FacilityService } from './facility.service';
import { FacilityUpdateComponent } from './update/facility-update.component';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
})
export class FacilityComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  facilities?: Facility[] = [];

  facilityTypes?: FacilityType[] = [];
  regions?: AdminHierarchy[] = [];
  councils?: AdminHierarchy[] = [];
  wards?: AdminHierarchy[] = [];
  villages?: AdminHierarchy[] = [];
  ownerships?: PlanrepEnum[] = [];
  physicalStates?: PlanrepEnum[] = [];
  starRatings?: PlanrepEnum[] = [];

  cols = [
    {
      field: 'code',
      header: 'Code',
      sort: true,
    },
    {
      field: 'name',
      header: 'Name',
      sort: true,
    },
    {
      field: 'ownership',
      header: 'Ownership',
      sort: true,
    },
    {
      field: 'physical_state',
      header: 'Physical State',
      sort: true,
    },
    {
      field: 'star_rating',
      header: 'Star Rating',
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
  facility_type_id!: number;
  admin_hierarchy_id!: number;

  constructor(
    protected facilityService: FacilityService,
    protected facilityTypeService: FacilityTypeService,
    protected adminHierarchyService: AdminHierarchyService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected enumService: EnumService,
    protected userService: UserService
  ) {}

  ngOnInit(): void {
    this.facilityTypeService
      .query({ columns: ['id', 'name', 'code'] })
      .subscribe(
        (resp: CustomResponse<FacilityType[]>) =>
          (this.facilityTypes = resp.data)
      );

    this.ownerships = this.enumService.get('ownerships');
    this.physicalStates = this.enumService.get('physicalStates');
    this.starRatings = this.enumService.get('starRatings');
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.facility_type_id || !this.admin_hierarchy_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.facilityService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        facility_type_id: this.facility_type_id,
        admin_hierarchy_id: this.admin_hierarchy_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<Facility[]>) => {
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
   *
   * @param event adminhierarchyId or Ids
   */
  onAdminHierarchySelection(event: number): void {
    this.admin_hierarchy_id = event;
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
   * Creating or updating Facility
   * @param facility ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(facility?: Facility): void {
    const data: Facility = facility ?? {
      ...new Facility(),
      facility_type_id: this.facility_type_id,
      admin_hierarchy_id: this.admin_hierarchy_id,
    };
    const ref = this.dialogService.open(FacilityUpdateComponent, {
      data,
      header: 'Create/Update Facility',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete Facility
   * @param facility
   */
  delete(facility: Facility): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Facility?',
      accept: () => {
        this.facilityService.delete(facility.id!).subscribe((resp) => {
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
    resp: CustomResponse<Facility[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/facility'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.facilities = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Facility');
  }
}
