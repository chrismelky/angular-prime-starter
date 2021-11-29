/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
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
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';

import { PerformanceIndicator } from './performance-indicator.model';
import { PerformanceIndicatorService } from './performance-indicator.service';
import { PerformanceIndicatorUpdateComponent } from './update/performance-indicator-update.component';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-performance-indicator',
  templateUrl: './performance-indicator.component.html',
})
export class PerformanceIndicatorComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  performanceIndicators?: PerformanceIndicator[] = [];

  objectives?: Objective[] = [];
  sections?: Section[] = [];
  section?: Section;
  sectorId: Subject<number> = new Subject();

  cols = [
    {
      field: 'description',
      header: 'Description',
      sort: true,
    },
    {
      field: 'number',
      header: 'Number',
      sort: false,
    },
    {
      field: 'section_id',
      header: 'Section ',
      sort: true,
    },
    {
      field: 'is_qualitative',
      header: 'Is Qualitative',
      sort: false,
    },
    {
      field: 'less_is_good',
      header: 'Less Is Good',
      sort: false,
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
  currentUser?: User;

  //Mandatory filter
  objective!: Objective;

  constructor(
    protected performanceIndicatorService: PerformanceIndicatorService,
    protected objectiveService: ObjectiveService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected userService: UserService
  ) {
    this.currentUser = userService.getCurrentUser();
  }

  ngOnInit(): void {
    if (this.currentUser?.section) {
      const parent = `p${this.currentUser.section.position}`;
      const parentId = this.currentUser.section_id;
      const userSectionId = this.currentUser.section_id;
      this.sectionService
        .targetSections(parent, parentId!, userSectionId!)
        .subscribe((resp: CustomResponse<Section[]>) => {
          this.sections = resp.data;
        });
    }
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.objective) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.performanceIndicatorService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        objective_id: this.objective.id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<PerformanceIndicator[]>) => {
          this.isLoading = false;
          this.onSuccess(res, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  sectorChanged(): void {
    this.sectorId?.next(this.section?.sector_id);
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

  onObjectiveSeletion($event: any): void {
    this.objective = $event;
    this.objectives = [this.objective];
    if ($event) {
      this.filterChanged();
    } else {
      this.performanceIndicators = [];
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
   * Creating or updating PerformanceIndicator
   * @param performanceIndicator ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(performanceIndicator?: PerformanceIndicator): void {
    const indicator: PerformanceIndicator = performanceIndicator ?? {
      ...new PerformanceIndicator(),
      objective_id: this.objective.id,
      section_id: this.section?.id,
      is_active: true,
    };
    const ref = this.dialogService.open(PerformanceIndicatorUpdateComponent, {
      data: {
        indicator,
        sections: this.sections,
        objectives: this.objectives,
      },
      header: 'Create/Update PerformanceIndicator',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete PerformanceIndicator
   * @param performanceIndicator
   */
  delete(performanceIndicator: PerformanceIndicator): void {
    this.confirmationService.confirm({
      message:
        'Are you sure that you want to delete this PerformanceIndicator?',
      accept: () => {
        this.performanceIndicatorService
          .delete(performanceIndicator.id!)
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
    resp: CustomResponse<PerformanceIndicator[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/performance-indicator'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            (this.predicate || 'id') + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.performanceIndicators = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Performance Indicator');
  }

  ngOnDestroy(): void {
    this.sectorId.next();
    this.sectorId.complete();
  }
}
