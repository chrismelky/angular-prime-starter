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
import { ReferenceDocument } from "src/app/setup/reference-document/reference-document.model";
import { ReferenceDocumentService } from "src/app/setup/reference-document/reference-document.service";
import { CasAssessmentState } from "src/app/setup/cas-assessment-state/cas-assessment-state.model";
import { CasAssessmentStateService } from "src/app/setup/cas-assessment-state/cas-assessment-state.service";
import { CasAssessmentCategory } from "src/app/setup/cas-assessment-category/cas-assessment-category.model";
import { CasAssessmentCategoryService } from "src/app/setup/cas-assessment-category/cas-assessment-category.service";

import { CasAssessmentCategoryVersion } from "./cas-assessment-category-version.model";
import { CasAssessmentCategoryVersionService } from "./cas-assessment-category-version.service";
import { CasAssessmentCategoryVersionUpdateComponent } from "./update/cas-assessment-category-version-update.component";

@Component({
  selector: "app-cas-assessment-category-version",
  templateUrl: "./cas-assessment-category-version.component.html",
})
export class CasAssessmentCategoryVersionComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  casAssessmentCategoryVersions?: CasAssessmentCategoryVersion[] = [];

  financialYears?: FinancialYear[] = [];
  referenceDocuments?: ReferenceDocument[] = [];
  casAssessmentStates?: CasAssessmentState[] = [];
  casAssessmentCategories?: CasAssessmentCategory[] = [];

  cols = [
    /*{
      field: "reference_document_id",
      header: "Reference Document ",
      sort: false,
    },
    {
      field: "cas_assessment_state_id",
      header: "Cas Assessment State ",
      sort: false,
    },
    {
      field: "cas_assessment_category_id",
      header: "Cas Assessment Category ",
      sort: false,
    },*/
    {
      field: "minimum_passmark",
      header: "Minimum Passmark",
      sort: true,
    },
    {
      field: "highest_score",
      header: "Highest Score",
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
  financial_year_id!: number;

  constructor(
    protected casAssessmentCategoryVersionService: CasAssessmentCategoryVersionService,
    protected financialYearService: FinancialYearService,
    protected referenceDocumentService: ReferenceDocumentService,
    protected casAssessmentStateService: CasAssessmentStateService,
    protected casAssessmentCategoryService: CasAssessmentCategoryService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.referenceDocumentService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<ReferenceDocument[]>) =>
          (this.referenceDocuments = resp.data)
      );
    this.casAssessmentStateService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentState[]>) =>
          (this.casAssessmentStates = resp.data)
      );
    this.casAssessmentCategoryService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentCategory[]>) =>
          (this.casAssessmentCategories = resp.data)
      );
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
    this.casAssessmentCategoryVersionService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        financial_year_id: this.financial_year_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<CasAssessmentCategoryVersion[]>) => {
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
   * Creating or updating CasAssessmentCategoryVersion
   * @param casAssessmentCategoryVersion ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(
    casAssessmentCategoryVersion?: CasAssessmentCategoryVersion
  ): void {
    const data: CasAssessmentCategoryVersion = casAssessmentCategoryVersion ?? {
      ...new CasAssessmentCategoryVersion(),
      financial_year_id: this.financial_year_id,
    };
    const ref = this.dialogService.open(
      CasAssessmentCategoryVersionUpdateComponent,
      {
        data,
        header: "Create/Update CasAssessmentCategoryVersion",
      }
    );
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete CasAssessmentCategoryVersion
   * @param casAssessmentCategoryVersion
   */
  delete(casAssessmentCategoryVersion: CasAssessmentCategoryVersion): void {
    this.confirmationService.confirm({
      message:
        "Are you sure that you want to delete this CasAssessmentCategoryVersion?",
      accept: () => {
        this.casAssessmentCategoryVersionService
          .delete(casAssessmentCategoryVersion.id!)
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
    resp: CustomResponse<CasAssessmentCategoryVersion[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/cas-assessment-category-version"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.casAssessmentCategoryVersions = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Cas Assessment Category Version");
  }
}
