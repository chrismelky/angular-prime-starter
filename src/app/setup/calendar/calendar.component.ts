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
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { CasAssessmentRound } from 'src/app/setup/cas-assessment-round/cas-assessment-round.model';
import { CasAssessmentRoundService } from 'src/app/setup/cas-assessment-round/cas-assessment-round.service';
import { SectionLevel } from 'src/app/setup/section-level/section-level.model';
import { SectionLevelService } from 'src/app/setup/section-level/section-level.service';
import { Sector } from 'src/app/setup/sector/sector.model';
import { SectorService } from 'src/app/setup/sector/sector.service';
import { CalendarEvent } from 'src/app/setup/calendar-event/calendar-event.model';
import { CalendarEventService } from 'src/app/setup/calendar-event/calendar-event.service';

import { Calendar } from './calendar.model';
import { CalendarService } from './calendar.service';
import { CalendarUpdateComponent } from './update/calendar-update.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  calendars?: Calendar[] = [];

  financialYears?: FinancialYear[] = [];
  casAssessmentRounds?: CasAssessmentRound[] = [];
  sectionLevels?: SectionLevel[] = [];
  sectors?: Sector[] = [];
  calendarEvents?: CalendarEvent[] = [];

  cols = [
    {
      field: 'description',
      header: 'Description',
      sort: false,
    },
    {
      field: 'start_date',
      header: 'Start Date',
      sort: true,
    },
    {
      field: 'end_date',
      header: 'End Date',
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
  calendar_event_id!: number;
  financial_year_id!: number;

  constructor(
    protected calendarService: CalendarService,
    protected financialYearService: FinancialYearService,
    protected casAssessmentRoundService: CasAssessmentRoundService,
    protected sectionLevelService: SectionLevelService,
    protected sectorService: SectorService,
    protected calendarEventService: CalendarEventService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.casAssessmentRoundService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentRound[]>) =>
          (this.casAssessmentRounds = resp.data)
      );
    this.sectionLevelService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) =>
          (this.sectionLevels = resp.data)
      );
    this.sectorService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
      );
    this.calendarEventService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CalendarEvent[]>) =>
          (this.calendarEvents = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.calendar_event_id || !this.financial_year_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.calendarService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        calendar_event_id: this.calendar_event_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<Calendar[]>) => {
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
   * Creating or updating Calendar
   * @param calendar ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(calendar?: Calendar): void {
    const data: Calendar = calendar ?? {
      ...new Calendar(),
      calendar_event_id: this.calendar_event_id,
      financial_year_id: this.financial_year_id,
    };
    const ref = this.dialogService.open(CalendarUpdateComponent, {
      data,
      header: 'Create/Update Calendar',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete Calendar
   * @param calendar
   */
  delete(calendar: Calendar): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Calendar?',
      accept: () => {
        this.calendarService.delete(calendar.id!).subscribe((resp) => {
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
    resp: CustomResponse<Calendar[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/calendar'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.calendars = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Calendar');
  }
}
