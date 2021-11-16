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
import { EnumService, PlanrepEnum } from 'src/app/shared/enum.service';
import { DataSet } from 'src/app/setup/data-set/data-set.model';
import { DataSetService } from 'src/app/setup/data-set/data-set.service';
import { CategoryCombination } from 'src/app/setup/category-combination/category-combination.model';
import { CategoryCombinationService } from 'src/app/setup/category-combination/category-combination.service';
import { OptionSet } from 'src/app/setup/option-set/option-set.model';
import { OptionSetService } from 'src/app/setup/option-set/option-set.service';

import { DataElement } from './data-element.model';
import { DataElementService } from './data-element.service';
import { DataElementUpdateComponent } from './update/data-element-update.component';
import { CasPlan } from '../cas-plan/cas-plan.model';
import { CasPlanService } from '../cas-plan/cas-plan.service';

@Component({
  selector: 'app-data-element',
  templateUrl: './data-element.component.html',
})
export class DataElementComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  dataElements?: DataElement[] = [];

  dataSets?: DataSet[] = [];
  categoryCombinations?: CategoryCombination[] = [];
  optionSets?: OptionSet[] = [];
  valueTypes?: PlanrepEnum[] = [];
  casPlans?: CasPlan[] = [];
  cas_plan_id!: number;

  cols = [
    {
      field: 'name',
      header: 'Name',
      sort: true,
    },
    {
      field: 'question_number',
      header: 'Question Number',
      sort: true,
    },
    {
      field: 'sort_order',
      header: 'Sort Order',
      sort: false,
    },
    {
      field: 'value_type',
      header: 'Value Type',
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
  data_set_id!: number;

  constructor(
    protected dataElementService: DataElementService,
    protected dataSetService: DataSetService,
    protected categoryCombinationService: CategoryCombinationService,
    protected optionSetService: OptionSetService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected enumService: EnumService,
    protected casPlanService: CasPlanService
  ) {}

  ngOnInit(): void {
    this.casPlanService
      .query({
        columns: ['id', 'name'],
      })
      .subscribe(
        (resp: CustomResponse<CasPlan[]>) => (this.casPlans = resp.data)
      );
    this.categoryCombinationService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CategoryCombination[]>) =>
          (this.categoryCombinations = resp.data)
      );
    this.optionSetService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<OptionSet[]>) => (this.optionSets = resp.data)
      );
    this.valueTypes = this.enumService.get('valueTypes');
    this.handleNavigation();
  }

  loadDataSet(): void {
    this.dataSetService
      .query({
        cas_plan_id: this.cas_plan_id,
        columns: ['id', 'name'],
        sort: ['name:asc'],
      })
      .subscribe(
        (resp: CustomResponse<DataSet[]>) => (this.dataSets = resp.data)
      );
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.data_set_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.dataElementService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        data_set_id: this.data_set_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<DataElement[]>) => {
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
   * Creating or updating DataElement
   * @param dataElement ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(dataElement?: DataElement): void {
    const data: DataElement = dataElement ?? {
      ...new DataElement(),
      data_set_id: this.data_set_id,
    };
    const ref = this.dialogService.open(DataElementUpdateComponent, {
      data: {
        dataElement: data,
        dataSets: this.dataSets,
      },
      header: 'Create/Update Data Element',
      width: '850px',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete DataElement
   * @param dataElement
   */
  delete(dataElement: DataElement): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this DataElement?',
      accept: () => {
        this.dataElementService.delete(dataElement.id!).subscribe((resp) => {
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
    resp: CustomResponse<DataElement[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/data-element'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            (this.predicate || 'id') + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.dataElements = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Data Element');
  }
}
