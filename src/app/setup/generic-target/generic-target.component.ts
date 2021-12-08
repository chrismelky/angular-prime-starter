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
import { Objective } from 'src/app/setup/objective/objective.model';
import { ObjectiveService } from 'src/app/setup/objective/objective.service';
import { PlanningMatrix } from 'src/app/setup/planning-matrix/planning-matrix.model';
import { PlanningMatrixService } from 'src/app/setup/planning-matrix/planning-matrix.service';

import { GenericTarget } from './generic-target.model';
import { GenericTargetService } from './generic-target.service';
import { GenericTargetUpdateComponent } from './update/generic-target-update.component';

@Component({
  selector: 'app-generic-target',
  templateUrl: './generic-target.component.html',
})
export class GenericTargetComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  genericTargets?: GenericTarget[] = [];

  objectives?: Objective[] = [];
  planningMatrices?: PlanningMatrix[] = [];

  cols = [
    {
      field: 'description',
      header: 'Description',
      sort: true,
    },
    {
      field: 'params',
      header: 'Params',
      sort: true,
    },
    {
      field: 'is_active',
      header: 'Is Active',
      sort: false,
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
  objective_id!: number;
  planning_matrix_id!: number;

  constructor(
    protected genericTargetService: GenericTargetService,
    protected objectiveService: ObjectiveService,
    protected planningMatrixService: PlanningMatrixService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.planningMatrixService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<PlanningMatrix[]>) =>
          (this.planningMatrices = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.objective_id || !this.planning_matrix_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.genericTargetService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        objective_id: this.objective_id,
        planning_matrix_id: this.planning_matrix_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<GenericTarget[]>) => {
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

  onObjectiveSeletion(id: number): void {
    this.objective_id = id;
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
   * Creating or updating GenericTarget
   * @param genericTarget ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(genericTarget?: GenericTarget): void {
    const data: GenericTarget = genericTarget ?? {
      ...new GenericTarget(),
      objective_id: this.objective_id,
      planning_matrix_id: this.planning_matrix_id,
      is_active: true,
    };
    const ref = this.dialogService.open(GenericTargetUpdateComponent, {
      data,
      header: 'Create/Update GenericTarget',
      width: '900px',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete GenericTarget
   * @param genericTarget
   */
  delete(genericTarget: GenericTarget): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this GenericTarget?',
      accept: () => {
        this.genericTargetService
          .delete(genericTarget.id!)
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
    resp: CustomResponse<GenericTarget[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/generic-target'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            (this.predicate || 'id') + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.genericTargets = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Generic Target');
  }
}
