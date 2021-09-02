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
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
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
import { DataElement } from 'src/app/setup/data-element/data-element.model';
import { DataElementService } from 'src/app/setup/data-element/data-element.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { Facility } from 'src/app/setup/facility/facility.model';
import { FacilityService } from 'src/app/setup/facility/facility.service';
import { CategoryOptionCombination } from 'src/app/setup/category-option-combination/category-option-combination.model';
import { CategoryOptionCombinationService } from 'src/app/setup/category-option-combination/category-option-combination.service';

import { DataValue } from './data-value.model';
import { DataValueService } from './data-value.service';
import { DataValueUpdateComponent } from './update/data-value-update.component';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

@Component({
  selector: 'app-data-value',
  templateUrl: './data-value.component.html',
})
export class DataValueComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  dataValues?: DataValue[] = [];

  dataElements?: DataElement[] = [];
  adminHierarchies: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  facilities?: Facility[] = [];
  categoryOptionCombinations?: CategoryOptionCombination[] = [];

  cols = [
    {
      field: 'data_element_id',
      header: 'Data Element ',
      sort: true,
    },
    {
      field: 'category_option_combination_id',
      header: 'Category Option Combination ',
      sort: true,
    },
    {
      field: 'value',
      header: 'Value',
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
  admin_hierarchy_id!: number;
  financial_year_id!: number;
  facility_id!: number;

  currentUser?: User;

  constructor(
    protected dataValueService: DataValueService,
    protected dataElementService: DataElementService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected facilityService: FacilityService,
    protected categoryOptionCombinationService: CategoryOptionCombinationService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected userService: UserService
  ) {
    this.currentUser = userService.getCurrentUser();
    if (this.currentUser.admin_hierarchy) {
      this.adminHierarchies?.push(this.currentUser.admin_hierarchy);
      this.admin_hierarchy_id = this.adminHierarchies[0].id!;
    }
  }

  ngOnInit(): void {
    this.dataElementService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<DataElement[]>) => (this.dataElements = resp.data)
      );
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.facilityService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Facility[]>) => (this.facilities = resp.data)
      );
    this.categoryOptionCombinationService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CategoryOptionCombination[]>) =>
          (this.categoryOptionCombinations = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.facility_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.dataValueService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        facility_id: this.facility_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<DataValue[]>) => {
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
   * Creating or updating DataValue
   * @param dataValue ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(dataValue?: DataValue): void {
    const data: DataValue = dataValue ?? {
      ...new DataValue(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      facility_id: this.facility_id,
    };
    const ref = this.dialogService.open(DataValueUpdateComponent, {
      data,
      header: 'Create/Update DataValue',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete DataValue
   * @param dataValue
   */
  delete(dataValue: DataValue): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this DataValue?',
      accept: () => {
        this.dataValueService.delete(dataValue.id!).subscribe((resp) => {
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
    resp: CustomResponse<DataValue[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/data-value'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.dataValues = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Data Value');
  }
}
