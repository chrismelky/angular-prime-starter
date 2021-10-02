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
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";

import { MyAssessment } from "./my-assessment.model";
import { MyAssessmentService } from "./my-assessment.service";
import { MyAssessmentUpdateComponent } from "./update/my-assessment-update.component";
import {CasAssessmentRound} from "../../setup/cas-assessment-round/cas-assessment-round.model";
import {User} from "../../setup/user/user.model";
import {UserService} from "../../setup/user/user.service";
import {AssessmentCriteriaService} from "../assessment-criteria/assessment-criteria.service";
import {AdminHierarchy} from "../../setup/admin-hierarchy/admin-hierarchy.model";

@Component({
  selector: "app-my-assessment",
  templateUrl: "./my-assessment.component.html",
})
export class MyAssessmentComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  myAssessments?: MyAssessment[] = [];


  financialYears?: FinancialYear[] = [];
  casAssessmentRounds?: CasAssessmentRound[] = [];
  adminHierarchies?: AdminHierarchy[] = [];

  cols = [
    { field: 'council', header: 'Council' },
    { field: 'round', header: 'Round' },
    { field: 'category', header: 'Category' },
    { field: 'minimum_passmark', header: 'Minimum Passmark' },
    { field: 'highest_score', header: 'Highest Score' },
    { field: 'score', header: 'Score' },
    { field: 'pct', header: '%' }
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
  admin_hierarchy_id!: number;
  financial_year_id!: number;
  cas_assessment_round_id!: number;
  cas_assessment_category_version_id: number;
  admin_hierarchy_position!:number;
  admin_hierarchy_level_id!: number | undefined;
  currentUser: User;

  constructor(
    protected assessmentCriteriaService: AssessmentCriteriaService,
    protected myAssessmentService: MyAssessmentService,
    protected financialYearService: FinancialYearService,
    protected actRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected userService: UserService,
    protected toastService: ToastService
  ) {
    this.cas_assessment_category_version_id = this.actRoute.snapshot.params.id;
    this.cas_assessment_round_id = this.actRoute.snapshot.params.round_id;
    this.financial_year_id = this.actRoute.snapshot.params.fy_id;
    this.currentUser = userService.getCurrentUser();
    this.admin_hierarchy_level_id = this.currentUser.admin_hierarchy?.admin_hierarchy_position;  }

  ngOnInit(): void {
    this.assessmentCriteriaService.getDataByUser(this.cas_assessment_round_id, this.financial_year_id,
      this.cas_assessment_category_version_id)
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
    if (!this.financial_year_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.myAssessmentService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        financial_year_id: this.financial_year_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<MyAssessment[]>) => {
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
      this.actRoute.data,
      this.actRoute.queryParamMap,
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
   * Creating or updating MyAssessment
   * @param myAssessment ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(myAssessment?: MyAssessment): void {
    const data: MyAssessment = myAssessment ?? {
      ...new MyAssessment(),
      financial_year_id: this.financial_year_id,
    };
    const ref = this.dialogService.open(MyAssessmentUpdateComponent, {
      data,
      header: "Create/Update MyAssessment",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete MyAssessment
   * @param myAssessment
   */
  delete(myAssessment: MyAssessment): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this MyAssessment?",
      accept: () => {
        this.myAssessmentService.delete(myAssessment.id!).subscribe((resp) => {
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
    resp: CustomResponse<MyAssessment[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/my-assessment"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.myAssessments = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading My Assessment");
  }

  finishAndQuit() {
    this.router.navigate(["/assessment-home"])
  }

  loadCouncils(adm: any) {
    this.myAssessmentService.getCouncils(adm.id,this.financial_year_id,this.cas_assessment_round_id,this.cas_assessment_category_version_id)
      .subscribe(resp => {
        this.myAssessments = resp.data;
      });
  }

  getReport(rowData: any) {
   this.assessmentCriteriaService.getAssessmentReport(rowData.admin_id,rowData.financial_year_id,rowData.round_id,rowData.version_id)
     .subscribe(resp =>{
       let file = new Blob([resp], { type: 'application/pdf'});
       let fileURL = URL.createObjectURL(file);
       window.open(fileURL,"_blank");
     })
  }
}
