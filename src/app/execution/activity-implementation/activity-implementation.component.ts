/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { ConfirmationService, LazyLoadEvent, MenuItem } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { Paginator } from "primeng/paginator";
import { Table } from "primeng/table";

import { CustomResponse } from "../../utils/custom-response";
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "../../config/pagination.constants";
import { HelperService } from "src/app/utils/helper.service";
import { ToastService } from "src/app/shared/toast.service";
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";
import { Period } from "src/app/setup/period/period.model";
import { PeriodService } from "src/app/setup/period/period.service";
import { FacilityType } from "src/app/setup/facility-type/facility-type.model";
import { FacilityTypeService } from "src/app/setup/facility-type/facility-type.service";
import { Facility } from "src/app/setup/facility/facility.model";
import { FacilityService } from "src/app/setup/facility/facility.service";

import { ActivityImplementation } from "./activity-implementation.model";
import { ActivityImplementationService } from "./activity-implementation.service";
import { ActivityImplementationUpdateComponent } from "./update/activity-implementation-update.component";
import {FundSource} from "../../setup/fund-source/fund-source.model";
import {FundSourceService} from "../../setup/fund-source/fund-source.service";

@Component({
  selector: "app-activity-implementation",
  templateUrl: "./activity-implementation.component.html",
})
export class ActivityImplementationComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;

  activityImplementations?: ActivityImplementation[];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: any;
  periods?: Period[] = [];
  facilityTypes?: FacilityType[] = [];
  facilities?: Facility[] = [];

  fundSources?: FundSource[] = [];

  cols = [ ]; //Table display columns

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
  financial_year_id!: number | undefined;
  period_id!: number;
  facility_type_id!: number;
  facility_id!: number;
  fund_source_id!: number;


  constructor(
    protected activityImplementationService: ActivityImplementationService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected periodService: PeriodService,
    protected facilityTypeService: FacilityTypeService,
    protected facilityService: FacilityService,
    protected fundSourceService: FundSourceService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {

  }

  ngOnInit(): void {
    this.activityImplementations = [
      {
        id: 1,
        code: 'C01S01',
        description: 'To conduct annual training to 1health care provider from Soya dispensary on proper  use of patograph by June 2020',
        budget: 2000000,
        expenditure: 500000,
        balance: 1500000
      },{
        id: 2,
        code: 'D01S02',
        description: 'To provide Capitation Grant to 691 students at Sogesca Secondary School',
        budget: 1000000,
        expenditure: 500000,
        balance: 500000
      },{
        id: 3,
        code: 'C01S22',
        description: 'To provide monthly employees benefits for 1 casual labourers in Kidoka Dispensary  by June 2020',
        budget: 2000000,
        expenditure: 1000000,
        balance: 1000000
      },{
        id: 4,
        code: 'C01S12',
        description: 'To facilitate good working environment to 5 staffs by June 2020',
        budget: 200000,
        expenditure: 50000,
        balance: 150000
      },{
        id: 5,
        code: 'C01S05',
        description: 'To facilitate Construction of Samazi Health Centre at Samazi Ward by, June 2019',
        budget: 2000000,
        expenditure: 500000,
        balance: 1500000
      },{
        id: 6,
        code: 'C01S06',
        description: 'To facilitate quarterly Economics, and infrastructure committee meeting by june  2020',
        budget: 2000000,
        expenditure: 500000,
        balance: 1500000
      },{
        id: 7,
        code: 'C01S11',
        description: 'To conduct mothly QIT meeting to 12 Health care providers at Hamai RHC by june 2020',
        budget: 2000000,
        expenditure: 500000,
        balance: 1500000
      },{
        id: 8,
        code: 'C01S91',
        description: 'To provide Capitation Grant to 1166 students at Ngasamo Secondary School',
        budget: 2000000,
        expenditure: 500000,
        balance: 1500000
      },{
        id: 9,
        code: 'C01S09',
        description: 'To purchase 1 kit of supplementary drugs and medical supplies for RCH  services   by june 2020',
        budget: 2000000,
        expenditure: 500000,
        balance: 1500000
      },{
        id: 10,
        code: 'C01S10',
        description: 'To provide Responsibility Allowance to 68 Head Teachers  by June 2020',
        budget: 2000000,
        expenditure: 500000,
        balance: 1500000
      },
    ];

    this.adminHierarchyService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.financialYearService
      .findByStatus(2)
      .subscribe(
        (resp: CustomResponse<FinancialYear>) =>
        {
          this.financial_year_id = resp.data?.id;
        }
      );
    this.periodService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Period[]>) => (this.periods = resp.data)
      );
    this.facilityTypeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FacilityType[]>) =>
          (this.facilityTypes = resp.data)
      );
    this.fundSourceService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundSource[]>) =>
          (this.fundSources = resp.data)
      );
    this.facilityService
      .query({ facility_type_id: this.facility_type_id })
      .subscribe(
        (resp: CustomResponse<Facility[]>) => (this.facilities = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.period_id ||
      !this.facility_type_id ||
      !this.facility_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.activityImplementationService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        period_id: this.period_id,
        facility_type_id: this.facility_type_id,
        facility_id: this.facility_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<ActivityImplementation[]>) => {
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
      const page = params.get("page");
      const perPage = params.get("per_page");
      const sort = (params.get("sort") ?? data["defaultSort"]).split(":");
      const predicate = sort[0];
      const ascending = sort[1] === "asc";
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
    const predicate = this.predicate ? this.predicate : "id";
    const direction = this.ascending ? "asc" : "desc";
    return [`${predicate}:${direction}`];
  }

  /**
   * Creating or updating ActivityImplementation
   * @param activityImplementation ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(activityImplementation?: ActivityImplementation): void {
    const data: ActivityImplementation = activityImplementation ?? {
      ...new ActivityImplementation(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      period_id: this.period_id,
      facility_type_id: this.facility_type_id,
      facility_id: this.facility_id,
    };
    const ref = this.dialogService.open(ActivityImplementationUpdateComponent, {
      data,
      header: "ActivityImplementation",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete ActivityImplementation
   * @param activityImplementation
   */
  delete(activityImplementation: ActivityImplementation): void {
    this.confirmationService.confirm({
      message:
        "Are you sure that you want to delete this ActivityImplementation?",
      accept: () => {
        this.activityImplementationService
          .delete(activityImplementation.id!)
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
    resp: CustomResponse<ActivityImplementation[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/activity-implementation"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    // this.activityImplementations = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Activity Implementation");
  }

  track(item: any) {
    const data: ActivityImplementation = item ?? {
      ...new ActivityImplementation(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      period_id: this.period_id,
      facility_type_id: this.facility_type_id,
      facility_id: this.facility_id,
    };

    const ref = this.dialogService.open(ActivityImplementationUpdateComponent, {
      data,
      header: "Activity Implementation",
      width:"55%",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  history(item: any) {
    const data: ActivityImplementation = item ?? {
      ...new ActivityImplementation(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      period_id: this.period_id,
      facility_type_id: this.facility_type_id,
      facility_id: this.facility_id,
    };
    const ref = this.dialogService.open(ActivityImplementationUpdateComponent, {
      data,
      header: "Activity Implementation",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  attachments(item: any) {
    const data: ActivityImplementation = item ?? {
      ...new ActivityImplementation(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      period_id: this.period_id,
      facility_type_id: this.facility_type_id,
      facility_id: this.facility_id,
    };
    const ref = this.dialogService.open(ActivityImplementationUpdateComponent, {
      data,
      header: "Activity Implementation",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }
}
