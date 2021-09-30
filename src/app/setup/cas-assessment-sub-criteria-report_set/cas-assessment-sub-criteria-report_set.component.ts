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
import { CasPlanContent } from "src/app/setup/cas-plan-content/cas-plan-content.model";
import { CasPlanContentService } from "src/app/setup/cas-plan-content/cas-plan-content.service";
import { CasAssessmentSubCriteriaOption } from "src/app/setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.model";
import { CasAssessmentSubCriteriaOptionService } from "src/app/setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.service";

import { CasAssessmentSubCriteriaReportSet } from "./cas-assessment-sub-criteria-report_set.model";
import { CasAssessmentSubCriteriaReportSetService } from "./cas-assessment-sub-criteria-report_set.service";
import { CasAssessmentSubCriteriaReportSetUpdateComponent } from "./update/cas-assessment-sub-criteria-report_set-update.component";
import {CasAssessmentCriteriaOption} from "../cas-assessment-criteria-option/cas-assessment-criteria-option.model";
import {CasAssessmentCriteriaOptionService} from "../cas-assessment-criteria-option/cas-assessment-criteria-option.service";

@Component({
  selector: "app-cas-assessment-sub-criteria-report_set",
  templateUrl: "./cas-assessment-sub-criteria-report_set.component.html",
})
export class CasAssessmentSubCriteriaReportSetComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  casAssessmentSubCriteriaReportSets?: CasAssessmentSubCriteriaReportSet[] = [];

  casPlanContents?: CasPlanContent[] = [];
  casAssessmentSubCriteriaOptions?: CasAssessmentSubCriteriaOption[] = [];

  casAssessmentCriteriaOptions?: CasAssessmentCriteriaOption[] = [];

  cols = [
    {
      field: "name",
      header: "Name",
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
  cas_plan_content_id!: number;
  cas_assessment_sub_criteria_option_id!: number;
  cas_assessment_criteria_option_id!: number;

  constructor(
    protected casAssessmentSubCriteriaReportSetService: CasAssessmentSubCriteriaReportSetService,
    protected casPlanContentService: CasPlanContentService,
    protected casAssessmentSubCriteriaOptionService: CasAssessmentSubCriteriaOptionService,
    protected casAssessmentCriteriaOptionService: CasAssessmentCriteriaOptionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casPlanContentService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasPlanContent[]>) =>
          (this.casPlanContents = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.cas_plan_content_id ||
      !this.cas_assessment_sub_criteria_option_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.casAssessmentSubCriteriaReportSetService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        cas_plan_content_id: this.cas_plan_content_id,
        cas_assessment_sub_criteria_option_id:
          this.cas_assessment_sub_criteria_option_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<CasAssessmentSubCriteriaReportSet[]>) => {
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
   * Creating or updating CasAssessmentSubCriteriaReportSet
   * @param casAssessmentSubCriteriaReportSet ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(
    casAssessmentSubCriteriaReportSet?: CasAssessmentSubCriteriaReportSet
  ): void {
    const data: CasAssessmentSubCriteriaReportSet =
      casAssessmentSubCriteriaReportSet ?? {
        ...new CasAssessmentSubCriteriaReportSet(),
        cas_plan_content_id: this.cas_plan_content_id,
        cas_assessment_sub_criteria_option_id:
          this.cas_assessment_sub_criteria_option_id,
      };
    const ref = this.dialogService.open(
      CasAssessmentSubCriteriaReportSetUpdateComponent,
      {
        data,
        header: "Create/Update CasAssessmentSubCriteriaReportSet",
      }
    );
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete CasAssessmentSubCriteriaReportSet
   * @param casAssessmentSubCriteriaReportSet
   */
  delete(
    casAssessmentSubCriteriaReportSet: CasAssessmentSubCriteriaReportSet
  ): void {
    this.confirmationService.confirm({
      message:
        "Are you sure that you want to delete this CasAssessmentSubCriteriaReportSet?",
      accept: () => {
        this.casAssessmentSubCriteriaReportSetService
          .delete(casAssessmentSubCriteriaReportSet.id!)
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
    resp: CustomResponse<CasAssessmentSubCriteriaReportSet[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/cas-assessment-sub-criteria-report_set"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.casAssessmentSubCriteriaReportSets = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error(
      "Error loading Cas Assessment Sub Criteria Report Set"
    );
  }
  /**
   * fetch cas assessment criteria based on selected cas plan content
   */
  fetchCriteria(item: any) {
    this.casAssessmentCriteriaOptionService
      .query({cas_plan_content_id: item.value})
      .subscribe(
        (resp: CustomResponse<CasAssessmentCriteriaOption[]>) =>
          (this.casAssessmentCriteriaOptions = resp.data)
      );
  }
  /**
   * fetch cas assessment Sub criteria based on selected cas assessment criteria
   */
  fetchSubCriteria(item: any) {
    if (item) {
      this.casAssessmentSubCriteriaOptionService
        .query({
          perPage: this.per_page,
          page: this.page,
          cas_assessment_criteria_option_id: item.value
        })
        .subscribe(
          (resp: CustomResponse<CasAssessmentSubCriteriaOption[]>) =>
            (this.casAssessmentSubCriteriaOptions = resp.data)
        );
    }
  }
}
