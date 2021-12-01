/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
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
import { StrategicPlan } from 'src/app/setup/strategic-plan/strategic-plan.model';
import { Objective } from 'src/app/setup/objective/objective.model';
import { ObjectiveService } from 'src/app/setup/objective/objective.service';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';

import { LongTermTarget } from './long-term-target.model';
import { LongTermTargetService } from './long-term-target.service';
import { LongTermTargetUpdateComponent } from './update/long-term-target-update.component';
import { UserService } from '../../setup/user/user.service';
import { User } from '../../setup/user/user.model';
import { FinancialYear } from '../../setup/financial-year/financial-year.model';
import { FinancialYearService } from '../../setup/financial-year/financial-year.service';
import { FinancialYearTarget } from './financial-year-target.model';
import { PerformanceIndicator } from '../../setup/performance-indicator/performance-indicator.model';
import { PerformanceIndicatorService } from '../../setup/performance-indicator/performance-indicator.service';
import { FinancialYearTargetViewComponent } from './financial-year-target-view/financial-year-target-view.component';

@Component({
  selector: 'app-long-term-target',
  templateUrl: './long-term-target.component.html',
})
export class LongTermTargetComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  longTermTargets?: LongTermTarget[] = [];

  objectives?: any[] = [];
  sections?: Section[] = [];
  section?: Section;
  showPrevious = false;

  isLoading = false;
  page?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects

  //Mandatory filter
  strategicPlan!: StrategicPlan;
  objective!: Objective;
  section_id!: number;
  currentUser?: User;
  financialYears: FinancialYear[] = [];
  allStrategicFinancialYears: FinancialYear[] = [];
  currentFinancialYear?: FinancialYear;
  indicators?: PerformanceIndicator[] = [];

  sectorId: Subject<number> = new Subject();

  constructor(
    protected longTermTargetService: LongTermTargetService,
    protected objectiveService: ObjectiveService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected userService: UserService,
    protected financialYearService: FinancialYearService,
    protected indicatorService: PerformanceIndicatorService
  ) {
    this.currentUser = userService.getCurrentUser();
  }

  ngOnInit(): void {
    this.financialYearService.findByStatus(1).subscribe((resp) => {
      this.currentFinancialYear = resp.data;
      this.handleNavigation();
    });

    if (this.currentUser?.section) {
      const parent = `p${this.currentUser.section.position}`;
      const parentId = this.currentUser.section_id;
      const userSectionId = this.currentUser.section_id;
      this.sectionService
        .targetSections(parent, parentId!, userSectionId!)
        .subscribe((resp: CustomResponse<Section[]>) => {
          this.sections = resp.data;
          if (this.sections?.length === 1) {
            this.section_id = this.sections[0].id!;
          }
        });
    }
  }

  sectorChanged(): void {
    this.sectorId?.next(this.section?.sector_id);
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.strategicPlan || !this.objective || !this.section) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.longTermTargetService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        strategic_plan_id: this.strategicPlan.id,
        objective_id: this.objective.id,
        section_id: this.section.id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<LongTermTarget[]>) => {
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
      this.strategicPlan = data.strategicPlan;
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
      this.loadFinancialYears();
    });
  }

  /**
   * Load financial years that belongs to strategic plan range
   */
  loadFinancialYears(): void {
    this.financialYearService
      .byRange(
        this.strategicPlan.start_financial_year_id!,
        this.strategicPlan.end_financial_year_id!
      )
      .subscribe((resp) => {
        this.allStrategicFinancialYears = resp.data || [];
        this.financialYears = this.allStrategicFinancialYears.filter(
          (fy) => fy.start_date! < this.currentFinancialYear?.end_date!
        );
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

  fyTargetSaved(result: FinancialYearTarget): void {
    this.loadPage();
  }

  onObjectiveSeletion($event: any): void {
    this.objective = $event;
    this.objectives = [this.objective];
    if ($event) {
      this.filterChanged();
    } else {
      this.longTermTargets = [];
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
   * Creating or updating LongTermTarget
   * @param longTermTarget ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(longTermTarget?: LongTermTarget): void {
    const target: LongTermTarget = longTermTarget ?? {
      ...new LongTermTarget(),
      strategic_plan_id: this.strategicPlan.id,
      objective_id: this.objective.id,
      section_id: this.section?.id,
      admin_hierarchy_id: this.strategicPlan.admin_hierarchy_id,
    };
    const ref = this.dialogService.open(LongTermTargetUpdateComponent, {
      data: {
        target,
        sections: this.sections,
        objectives: this.objectives,
      },
      header: 'Create/Update Target',
      width: '900px',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  financialYearTarget(
    longTermTarget: LongTermTarget,
    financialYearId: number,
    currentFinancialYear: FinancialYear
  ): void {
    const ref = this.dialogService.open(FinancialYearTargetViewComponent, {
      data: {
        longTermTarget,
        financialYearId,
        currentFinancialYear,
        section: this.section,
        strategicPlanAdminHierarchyId: this.strategicPlan.admin_hierarchy_id,
        currentPosition:
          this.currentUser?.admin_hierarchy?.admin_hierarchy_position,
      },
      width: '900px',
      header: 'Confirm Target and Priorities',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete LongTermTarget
   * @param longTermTarget
   */
  delete(longTermTarget: LongTermTarget): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this LongTermTarget?',
      accept: () => {
        this.longTermTargetService
          .delete(longTermTarget.id!)
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
    resp: CustomResponse<LongTermTarget[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(
        ['/strategic-plan', this.strategicPlan.id, 'long-term-target'],
        {
          queryParams: {
            page: this.page,
            per_page: this.per_page,
            sort:
              (this.predicate || 'id') +
              ':' +
              (this.ascending ? 'asc' : 'desc'),
          },
        }
      );
    }
    this.longTermTargets = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Long Term Target');
  }

  ngOnDestroy(): void {
    this.sectorId.next();
    this.sectorId.complete();
  }
}
