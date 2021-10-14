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
import { Activity } from 'src/app/planning/activity/activity.model';
import { ActivityService } from 'src/app/planning/activity/activity.service';
import { FundSource } from 'src/app/setup/fund-source/fund-source.model';
import { FundSourceService } from 'src/app/setup/fund-source/fund-source.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { Facility } from 'src/app/setup/facility/facility.model';
import { FacilityService } from 'src/app/setup/facility/facility.service';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { BudgetClass } from 'src/app/setup/budget-class/budget-class.model';
import { BudgetClassService } from 'src/app/setup/budget-class/budget-class.service';

import { ActivityInput } from './activity-input.model';
import { ActivityInputService } from './activity-input.service';
import { ActivityInputUpdateComponent } from './update/activity-input-update.component';

@Component({
  selector: 'app-activity-input',
  templateUrl: './activity-input.component.html',
})
export class ActivityInputComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  activityInputs?: ActivityInput[] = [];

  activities?: Activity[] = [];
  fundSources?: FundSource[] = [];
  financialYears?: FinancialYear[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  facilities?: Facility[] = [];
  sections?: Section[] = [];
  budgetClasses?: BudgetClass[] = [];
  units?: PlanrepEnum[] = [];

  cols = [
    {
      field: 'unit_price',
      header: 'Unit Price',
      sort: false,
    },
    {
      field: 'quantity',
      header: 'Quantity',
      sort: false,
    },
    {
      field: 'frequency',
      header: 'Frequency',
      sort: false,
    },
    {
      field: 'unit',
      header: 'Unit',
      sort: true,
    },
    {
      field: 'forward_year_one_amount',
      header: 'Forward Year One Amount',
      sort: false,
    },
    {
      field: 'forward_year_two_amount',
      header: 'Forward Year Two Amount',
      sort: false,
    },
    {
      field: 'chart_of_account',
      header: 'Chart Of Account',
      sort: true,
    },
    {
      field: 'approve_amount',
      header: 'Approve Amount',
      sort: false,
    },
    {
      field: 'adjusted_amount',
      header: 'Adjusted Amount',
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
  activity_id!: number;
  fund_source_id!: number;
  financial_year_id!: number;
  admin_hierarchy_id!: number;
  facility_id!: number;
  section_id!: number;
  budget_class_id!: number;

  constructor(
    protected activityInputService: ActivityInputService,
    protected activityService: ActivityService,
    protected fundSourceService: FundSourceService,
    protected financialYearService: FinancialYearService,
    protected adminHierarchyService: AdminHierarchyService,
    protected facilityService: FacilityService,
    protected sectionService: SectionService,
    protected budgetClassService: BudgetClassService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.activityService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Activity[]>) => (this.activities = resp.data)
      );
    this.fundSourceService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data)
      );
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.adminHierarchyService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.facilityService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Facility[]>) => (this.facilities = resp.data)
      );
    this.sectionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    this.budgetClassService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<BudgetClass[]>) =>
          (this.budgetClasses = resp.data)
      );
    this.units = this.enumService.get('units');
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.activity_id ||
      !this.fund_source_id ||
      !this.financial_year_id ||
      !this.admin_hierarchy_id ||
      !this.facility_id ||
      !this.section_id ||
      !this.budget_class_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.activityInputService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        activity_id: this.activity_id,
        fund_source_id: this.fund_source_id,
        financial_year_id: this.financial_year_id,
        admin_hierarchy_id: this.admin_hierarchy_id,
        facility_id: this.facility_id,
        section_id: this.section_id,
        budget_class_id: this.budget_class_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<ActivityInput[]>) => {
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
   * Creating or updating ActivityInput
   * @param activityInput ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(activityInput?: ActivityInput): void {
    const data: ActivityInput = activityInput ?? {
      ...new ActivityInput(),
      activity_id: this.activity_id,
      fund_source_id: this.fund_source_id,
      financial_year_id: this.financial_year_id,
      admin_hierarchy_id: this.admin_hierarchy_id,
      facility_id: this.facility_id,
      section_id: this.section_id,
      budget_class_id: this.budget_class_id,
    };
    const ref = this.dialogService.open(ActivityInputUpdateComponent, {
      data,
      header: 'Create/Update ActivityInput',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete ActivityInput
   * @param activityInput
   */
  delete(activityInput: ActivityInput): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this ActivityInput?',
      accept: () => {
        this.activityInputService
          .delete(activityInput.id!)
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
    resp: CustomResponse<ActivityInput[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/activity-input'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.activityInputs = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Activity Input');
  }
}
