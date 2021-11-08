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
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { BudgetClass } from 'src/app/setup/budget-class/budget-class.model';
import { BudgetClassService } from 'src/app/setup/budget-class/budget-class.service';
import { ActivityType } from 'src/app/setup/activity-type/activity-type.model';
import { ActivityTypeService } from 'src/app/setup/activity-type/activity-type.service';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { SectionService } from 'src/app/setup/section/section.service';
import { FacilityView } from 'src/app/setup/facility/facility.model';
import { FacilityService } from 'src/app/setup/facility/facility.service';

import { Activity } from './activity.model';
import { ActivityService } from './activity.service';
import { ActivityUpdateComponent } from './update/activity-update.component';
import { FinancialYearTarget } from '../long-term-target/financial-year-target.model';
import { FinancialYearTargetService } from '../long-term-target/financial-year-target.service';
import { AdminHierarchyCostCentre } from '../admin-hierarchy-cost-centres/admin-hierarchy-cost-centre.model';
import { ProjectTypeService } from 'src/app/setup/project-type/project-type.service';
import { ProjectType } from 'src/app/setup/project-type/project-type.model';
import { ScrutinizationService } from '../scrutinization/scrutinization.service';
import { Comment } from '../scrutinization/comment/comment.model';
import { AddressCommentComponent } from 'src/app/shared/address-comment/address-comment.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
})
export class ActivityComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;

  budgetIsLocked? = false;

  facilityIsLoading = false;
  targetIsLoading = false;
  objectiveIsLoading = false;

  adminHierarchyCostCentre?: AdminHierarchyCostCentre;
  financialYear?: FinancialYear;

  activities?: Activity[] = [];

  financialYearTargets?: FinancialYearTarget[] = [];
  budgetClasses?: BudgetClass[] = [];
  activityTypes?: ActivityType[] = [];
  facilities?: FacilityView[] = [];
  facilityGroupByType?: any[] = [];
  facilityType?: string;
  periodTypes?: PlanrepEnum[] = [];
  projectTypes?: ProjectType[] = [];

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
  targets?: FinancialYearTarget[] = [];
  objective: any;

  //Mandatory filter
  financialYearTarget?: FinancialYearTarget; /** Selected Target object to diaplay target info wheen creating activity */
  budget_type!: string;
  facility_id!: number;

  constructor(
    protected activityService: ActivityService,
    protected financialYearTargetService: FinancialYearTargetService,
    protected financialYearService: FinancialYearService,
    protected budgetClassService: BudgetClassService,
    protected activityTypeService: ActivityTypeService,
    protected adminHierarchyService: AdminHierarchyService,
    protected sectionService: SectionService,
    protected facilityService: FacilityService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected enumService: EnumService,
    protected projectTypeService: ProjectTypeService
  ) {}

  ngOnInit(): void {
    this.activityTypeService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<ActivityType[]>) =>
          (this.activityTypes = resp.data)
      );
    this.projectTypeService.query().subscribe((resp) => {
      this.projectTypes = resp.data;
    });
    this.periodTypes = this.enumService.get('periodTypes');
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.financialYearTarget ||
      !this.financialYear ||
      !this.adminHierarchyCostCentre ||
      !this.budget_type ||
      !this.facility_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;

    this.activityService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        financial_year_target_id: this.financialYearTarget.id,
        financial_year_id: this.financialYear.id!,
        admin_hierarchy_id: this.adminHierarchyCostCentre.admin_hierarchy_id,
        section_id: this.adminHierarchyCostCentre.section_id,
        budget_type: this.budget_type,
        facility_id: this.facility_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<Activity[]>) => {
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
      this.activatedRoute.params,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([data, params, queryParams]) => {
      this.adminHierarchyCostCentre = data.adminHierarchyCostCentre;
      this.budget_type = params['budgetType'];
      this.financialYear = data.financialYear;

      const page = queryParams.get('page');
      const perPage = queryParams.get('per_page');
      const sort = (queryParams.get('sort') ?? data['defaultSort']).split(':');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      this.per_page = perPage !== null ? parseInt(perPage) : ITEMS_PER_PAGE;
      this.page = page !== null ? parseInt(page) : 1;
      if (predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
      }
      this.setBudgetStatus();

      this.loadTargets();

      this.loadFacilities();
    });
  }

  private setBudgetStatus(): void {
    switch (this.budget_type) {
      case 'CURRENT':
        this.budgetIsLocked =
          this.adminHierarchyCostCentre?.is_current_budget_locked ||
          this.adminHierarchyCostCentre?.is_current_budget_approved;
        break;
      case 'APPROVED':
        this.budgetIsLocked =
          this.adminHierarchyCostCentre?.is_current_budget_locked ||
          this.adminHierarchyCostCentre?.is_current_budget_approved;
        break;
      case 'CARRYOVER':
        this.budgetIsLocked =
          this.adminHierarchyCostCentre?.is_carryover_budget_locked ||
          this.adminHierarchyCostCentre?.is_carryover_budget_approved;
        break;
      case 'SUPPLEMENTARY':
        this.budgetIsLocked =
          this.adminHierarchyCostCentre?.is_supplementary_budget_locked ||
          this.adminHierarchyCostCentre?.is_supplementary_budget_approved;
        break;
      default:
        this.budgetIsLocked = false;
        break;
    }
  }

  addressComments(a: Activity): void {
    const ref = this.dialogService.open(AddressCommentComponent, {
      data: a.addressable_comments,
      width: '800px',
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        a.addressable_comments = result;
      }
    });
  }

  /**
   * load Targets by objectives and section
   */
  loadTargets(): void {
    this.targetIsLoading = true;
    this.financialYearTargetService
      .allByCostCentre(
        this.financialYear?.id!,
        this.adminHierarchyCostCentre?.admin_hierarchy_id!,
        this.adminHierarchyCostCentre?.section_id!
      )
      .subscribe(
        (resp: CustomResponse<FinancialYearTarget[]>) => {
          this.targets = resp.data?.map((t) => {
            return {
              ...t,
              description: `[ ${t.code} ] ${t.description}`,
            };
          });
          this.targetIsLoading = false;
        },
        (error) => {
          this.targetIsLoading = false;
        }
      );
  }

  loadFacilities(): void {
    const parentName = `p${this.adminHierarchyCostCentre?.admin_hierarchy?.admin_hierarchy_position}`;
    const parentId = this.adminHierarchyCostCentre?.admin_hierarchy_id;
    const sectionId = this.adminHierarchyCostCentre?.section_id;
    this.facilityIsLoading = true;
    this.facilityService.planning(parentName, parentId!, sectionId!).subscribe(
      (resp: CustomResponse<FacilityView[]>) => {
        this.facilityIsLoading = false;
        this.facilityGroupByType = this.helper.groupBy(resp.data!, 'type');
      },
      (error) => (this.facilityIsLoading = false)
    );
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
      this.loadPage(1, true);
    }
  }

  facilityTypeChange(): void {
    this.facilities =
      this.facilityGroupByType?.find((ft) => ft.name === this.facilityType)
        ?.values || [];
    this.facilities?.length === 1 &&
      (this.facility_id = this.facilities[0]?.id!);
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

  back(): void {
    this.router.navigate(['/admin-hierarchy-cost-centres', this.budget_type]);
  }

  /**
   * Creating or updating Activity
   * @param activity ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(activity?: Activity): void {
    const data: Activity = activity ?? {
      ...new Activity(),
      financial_year_target_id: this.financialYearTarget?.id,
      long_term_target_id: this.financialYearTarget?.long_term_target_id,
      financial_year_id: this.financialYear?.id,
      admin_hierarchy_id: this.adminHierarchyCostCentre?.admin_hierarchy_id,
      section_id: this.adminHierarchyCostCentre?.section_id,
      facility_id: this.facility_id,
      budget_type: this.budget_type,
      period_one: false,
      period_two: false,
      period_three: false,
      period_four: false,
    };
    const ref = this.dialogService.open(ActivityUpdateComponent, {
      data: {
        activity: data,
        facilities: this.facilities,
        objectiveId: this.financialYearTarget?.objective_id,
        genericTargetId: this.financialYearTarget?.generic_target_id,
        adminHierarchyCostCentre: this.adminHierarchyCostCentre,
        activityTypes: this.activityTypes,
        projectTypes: this.projectTypes,
        budgetIsLocked: this.budgetIsLocked,
      },
      header: 'Create/Update Activity',
      width: '900px',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete Activity
   * @param activity
   */
  delete(activity: Activity): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Activity?',
      accept: () => {
        this.activityService.delete(activity.id!).subscribe((resp) => {
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
    resp: CustomResponse<Activity[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    this.activities = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Activity');
  }
}
