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

import { Objective } from './objective.model';
import { ObjectiveService } from './objective.service';
import { ObjectiveUpdateComponent } from './update/objective-update.component';
import { ObjectiveTypeService } from '../objective-type/objective-type.service';
import { ObjectiveType } from '../objective-type/objective-type.model';

@Component({
  selector: 'app-objective',
  templateUrl: './objective.component.html',
})
export class ObjectiveComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  objectives?: Objective[] = [];

  cols = [
    {
      field: 'code',
      header: 'Code',
      sort: true,
    },
    {
      field: 'description',
      header: 'Description',
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
  objectiveTypes?: ObjectiveType[] = [];
  objectiveType?: ObjectiveType;
  parents?: Objective[] = [];
  parent: Objective | null = null;
  //Mandatory filter

  parentIsLoading = false;

  constructor(
    protected objectiveService: ObjectiveService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected objectiveTypeService: ObjectiveTypeService
  ) {}

  ngOnInit(): void {
    this.objectiveTypeService
      .query({
        columns: ['id', 'name', 'is_incremental', 'is_sectoral', 'position'],
      })
      .subscribe((resp) => {
        this.objectiveTypes = resp.data;
      });
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.objectiveType ||
      (this.objectiveType?.position! > 1 && !this.parent)
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    const parentFilter =
      this.objectiveType?.position! > 1 ? { parent_id: this.parent?.id } : {};

    this.objectiveService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: ['code:asc'],
        objective_type_id: this.objectiveType.id,
        ...parentFilter,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<Objective[]>) => {
          this.isLoading = false;
          this.onSuccess(res, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  loadParent(): void {
    if (this.objectiveType?.position! > 1) {
      this.parentIsLoading = true;
      const parentPosition = this.objectiveType?.position! - 1;
      const parentType = this.objectiveTypes?.find(
        (t) => t.position === parentPosition
      );
      this.objectiveService
        .query({
          objective_type_id: parentType?.id,
        })
        .subscribe(
          (resp) => {
            this.parents = resp.data;
            this.parentIsLoading = false;
          },
          (error) => {
            this.parentIsLoading = false;
          }
        );
    } else {
      this.parents = [];
      this.parent = null;
      this.filterChanged();
    }
    setTimeout(() => (this.objectives = []));
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
   * Creating or updating Objective
   * @param objective ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(objective?: Objective): void {
    const objectiveData: Objective = objective ?? {
      ...new Objective(),
      parent_id: this.parent?.id,
      objective_type_id: this.objectiveType?.id,
    };
    console.log(this.parent);
    console.log(objectiveData);
    const ref = this.dialogService.open(ObjectiveUpdateComponent, {
      data: {
        objectiveData,
        parents: this.parents,
        objectiveType: this.objectiveType,
      },
      header: `Create/Update ${this.objectiveType?.name}`,
      width: '900px',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete Objective
   * @param objective
   */
  delete(objective: Objective): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Objective?',
      accept: () => {
        this.objectiveService.delete(objective.id!).subscribe((resp) => {
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
    resp: CustomResponse<Objective[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/objective'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            (this.predicate || 'id') + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.objectives = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Objective');
  }
}
