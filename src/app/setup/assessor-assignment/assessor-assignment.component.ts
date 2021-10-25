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
import { User } from "src/app/setup/user/user.model";
import { UserService } from "src/app/setup/user/user.service";
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { AdminHierarchyLevel } from "src/app/setup/admin-hierarchy-level/admin-hierarchy-level.model";
import { AdminHierarchyLevelService } from "src/app/setup/admin-hierarchy-level/admin-hierarchy-level.service";
import { CasAssessmentRound } from "src/app/setup/cas-assessment-round/cas-assessment-round.model";
import { CasAssessmentRoundService } from "src/app/setup/cas-assessment-round/cas-assessment-round.service";
import { Period } from "src/app/setup/period/period.model";
import { PeriodService } from "src/app/setup/period/period.service";
import { CasAssessmentCategoryVersion } from "src/app/setup/cas-assessment-category-version/cas-assessment-category-version.model";
import { CasAssessmentCategoryVersionService } from "src/app/setup/cas-assessment-category-version/cas-assessment-category-version.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";

import { AssessorAssignment } from "./assessor-assignment.model";
import { AssessorAssignmentService } from "./assessor-assignment.service";
import { AssessorAssignmentUpdateComponent } from "./update/assessor-assignment-update.component";

@Component({
  selector: "app-assessor-assignment",
  templateUrl: "./assessor-assignment.component.html",
})
export class AssessorAssignmentComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  assessorAssignments?: AssessorAssignment[] = [];
  assessors?: User[] = [];

  users?: User[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  adminHierarchyLevels?: AdminHierarchyLevel[] = [];
  casAssessmentRounds?: CasAssessmentRound[] = [];
  periods?: Period[] = [];
  casAssessmentCategoryVersions?: CasAssessmentCategoryVersion[] = [];
  financialYears?: FinancialYear[] = [];

  cols = []; //Table display columns

  isLoading = false;
  page?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects

  //Mandatory filter
  cas_assessment_round_id!: number;
  period_id!: number;
  cas_assessment_category_version_id!: number;
  financial_year_id!: number;
  currentUser: User;
  assignedRegions: any;

  constructor(
    protected assessorAssignmentService: AssessorAssignmentService,
    protected userService: UserService,
    protected adminHierarchyService: AdminHierarchyService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService,
    protected casAssessmentRoundService: CasAssessmentRoundService,
    protected periodService: PeriodService,
    protected casAssessmentCategoryVersionService: CasAssessmentCategoryVersionService,
    protected financialYearService: FinancialYearService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {
    this.currentUser = this.userService.getCurrentUser();
  }

  ngOnInit(): void {
    this.adminHierarchyService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.casAssessmentRoundService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentRound[]>) =>
          (this.casAssessmentRounds = resp.data)
      );
    this.periodService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Period[]>) => (this.periods = resp.data)
      );
    this.casAssessmentCategoryVersionService
      .query({ columns: ["id", "cas_category_name"] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentCategoryVersion[]>) =>
          (this.casAssessmentCategoryVersions = resp.data)
      );
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.handleNavigation();
  }
loadAssessors (){
  if (
    !this.cas_assessment_round_id ||
    !this.period_id ||
    !this.cas_assessment_category_version_id ||
    !this.financial_year_id
  ) {
    return;
  }
  const data = {
    cas_assessment_round_id: this.cas_assessment_round_id,
    period_id: this.period_id,
    admin_hierarchy_level_id: this.currentUser.admin_hierarchy?.admin_hierarchy_position,
    cas_assessment_category_version_id: this.cas_assessment_category_version_id,
    financial_year_id: this.financial_year_id,
  };
  this.assessorAssignmentService
    .getAssessors(data)
    .subscribe(
      (resp: CustomResponse<AssessorAssignment[]>) =>
        (this.assessors = resp.data)
    );
}
  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.cas_assessment_round_id ||
      !this.period_id ||
      !this.cas_assessment_category_version_id ||
      !this.financial_year_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.assessorAssignmentService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        cas_assessment_round_id: this.cas_assessment_round_id,
        period_id: this.period_id,
        cas_assessment_category_version_id:
          this.cas_assessment_category_version_id,
        financial_year_id: this.financial_year_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<AssessorAssignment[]>) => {
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
      // this.loadAssessors();
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
   * Creating or updating AssessorAssignment
   * @param assessorAssignment ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(assessorAssignment?: AssessorAssignment): void {
    const data: AssessorAssignment = assessorAssignment ?? {
      ...new AssessorAssignment(),
      cas_assessment_round_id: this.cas_assessment_round_id,
      period_id: this.period_id,
      cas_assessment_category_version_id:
        this.cas_assessment_category_version_id,
      financial_year_id: this.financial_year_id,
    };
    const ref = this.dialogService.open(AssessorAssignmentUpdateComponent, {
      data,
      header: "Create/Update AssessorAssignment",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete AssessorAssignment
   * @param assessorAssignment
   */
  delete(assessorAssignment: AssessorAssignment): void {
    return;
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this AssessorAssignment?",
      accept: () => {
        this.assessorAssignmentService
          .delete(assessorAssignment.id!)
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
    resp: CustomResponse<AssessorAssignment[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/assessor-assignment"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.assessorAssignments = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Assessor Assignment");
  }

  loadRegions(user_id: number) {
    this.assessorAssignmentService
      .getAssignedRegions(this.cas_assessment_round_id,this.financial_year_id,this.cas_assessment_category_version_id,user_id,this.currentUser.admin_hierarchy?.admin_hierarchy_position)
      .subscribe((resp)=>(this.assignedRegions = resp.data));
  }

  removeRegion(assessor: any) {

  }
}
