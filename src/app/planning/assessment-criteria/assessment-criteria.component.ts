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
import {ConfirmationService, LazyLoadEvent, MenuItem, TreeNode} from "primeng/api";
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
import { CasAssessmentRound } from "src/app/setup/cas-assessment-round/cas-assessment-round.model";
import { CasAssessmentRoundService } from "src/app/setup/cas-assessment-round/cas-assessment-round.service";

import { AssessmentCriteria } from "./assessment-criteria.model";
import { AssessmentCriteriaService } from "./assessment-criteria.service";
import { AssessmentCriteriaUpdateComponent } from "./update/assessment-criteria-update.component";
import {CasAssessmentCriteriaOptionService} from "../../setup/cas-assessment-criteria-option/cas-assessment-criteria-option.service";
import {CasAssessmentSubCriteriaOptionService} from "../../setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.service";
import {CasAssessmentSubCriteriaOption} from "../../setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.model";

@Component({
  selector: "app-assessment-criteria",
  templateUrl: "./assessment-criteria.component.html",
})
export class AssessmentCriteriaComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  assessmentCriterias?: TreeNode[] = [];
  assessmentCriteriaData?: AssessmentCriteria[] = [];
  assessmentCriteriaNodeTree?: TreeNode[] = [];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  casAssessmentRounds?: CasAssessmentRound[] = [];

  cols = [{
    field: "name",
    header: "Name",
    sort: true,
  },
    {
      field: "number",
      header: "Number",
      sort: true,
    },]; //Table display columns

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
  financial_year_id!: number;
  cas_assessment_round_id!: number;
  cas_assessment_category_version_id: number;

  constructor(
    protected assessmentCriteriaService: AssessmentCriteriaService,
    protected casAssessmentSubCriteriaService: CasAssessmentSubCriteriaOptionService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected actRoute: ActivatedRoute,
    protected toastService: ToastService
  ) {
    this.cas_assessment_category_version_id = this.actRoute.snapshot.params.id;
    }

  ngOnInit(): void {
    this.assessmentCriteriaService.find(this.cas_assessment_category_version_id)
      .subscribe((resp:CustomResponse<AssessmentCriteria[]>) => {
        this.assessmentCriterias =(resp?.data ?? []).map((c) => {
          return {
            data: c,
            children: [],
            leaf: false,
          };
        });
      });

    this.assessmentCriteriaService.getDataByUser()
      .subscribe((resp) => {
        this.adminHierarchies = resp.data.adminHierarchies;
        this.financialYears = resp.data.financialYears;
        this.casAssessmentRounds = resp.data.casRounds;
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
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.cas_assessment_round_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.assessmentCriteriaService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        cas_assessment_round_id: this.cas_assessment_round_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<AssessmentCriteria[]>) => {
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
   * Creating or updating AssessmentCriteria
   * @param assessmentCriteria ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(assessmentCriteria?: AssessmentCriteria): void {
    const data: AssessmentCriteria = assessmentCriteria ?? {
      ...new AssessmentCriteria(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      cas_assessment_round_id: this.cas_assessment_round_id,
    };
    const ref = this.dialogService.open(AssessmentCriteriaUpdateComponent, {
      data,
      header: "Create/Update AssessmentCriteria",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete AssessmentCriteria
   * @param assessmentCriteria
   */
  delete(assessmentCriteria: AssessmentCriteria): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this AssessmentCriteria?",
      accept: () => {
        this.assessmentCriteriaService
          .delete(assessmentCriteria.id!)
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
    resp: CustomResponse<AssessmentCriteria[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/assessment-criteria"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.assessmentCriterias =(resp?.data ?? []).map((c) => {
      return {
        data: c,
        children: [],
        leaf: false,
      };
    });
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Assessment Criteria");
  }

  finishAndQuit() {
    this.router.navigate(["/assessment-home"])
  }

  onNodeExpand(event: any): void {
    const node = event.node;
    this.isLoading = true;
    // Load children by parent_id= node.data.id
    this.casAssessmentSubCriteriaService
      .query({
        page: this.page,
        per_page:this.per_page,
        cas_assessment_criteria_option_id: node.data.id,
        sort: ['id:asc'],
      })
      .subscribe(
        (resp:CustomResponse<CasAssessmentSubCriteriaOption[]>) => {
          this.isLoading = false;
          // Map response data to @TreeNode type
          node.children = (resp?.data ?? []).map((c:CasAssessmentSubCriteriaOption) => {
            return {
              data: c,
              children: [],
              leaf: false,
            };
          });
          // Update Tree state
          this.assessmentCriteriaNodeTree = [...this.assessmentCriteriaNodeTree!];
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }
}
