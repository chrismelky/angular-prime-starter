/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
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
import { CasAssessmentCategoryVersion } from "src/app/setup/cas-assessment-category-version/cas-assessment-category-version.model";
import { CasAssessmentCategoryVersionService } from "src/app/setup/cas-assessment-category-version/cas-assessment-category-version.service";
import { CasPlanContent } from "src/app/setup/cas-plan-content/cas-plan-content.model";
import { CasPlanContentService } from "src/app/setup/cas-plan-content/cas-plan-content.service";

import { CasAssessmentCriteriaOption } from "./cas-assessment-criteria-option.model";
import { CasAssessmentCriteriaOptionService } from "./cas-assessment-criteria-option.service";
import { CasAssessmentCriteriaOptionUpdateComponent } from "./update/cas-assessment-criteria-option-update.component";
import {AdminHierarchy} from "../admin-hierarchy/admin-hierarchy.model";
import {OverlayPanel} from "primeng/overlaypanel";
import {LocalStorageService} from "ngx-webstorage";
import {CasPlanService} from "../cas-plan/cas-plan.service";
import {CasPlan} from "../cas-plan/cas-plan.model";

@Component({
  selector: "app-cas-assessment-criteria-option",
  templateUrl: "./cas-assessment-criteria-option.component.html",
})
export class CasAssessmentCriteriaOptionComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  treeLoading: boolean = false;
  nodes: TreeNode[] = [];
  selectedValue: any;
  @Input() selectionMode: string = 'single';
  @Input() returnType: string = 'id';
  @Input() stateKey?: string;
  @Input() label: string = 'Cas Plan Contents';
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @ViewChild('op') panel!: OverlayPanel;
  casAssessmentCriteriaOptions?: CasAssessmentCriteriaOption[] = [];

  casAssessmentCategoryVersions?: CasAssessmentCategoryVersion[] = [];
  casPlanContents: CasPlanContent[] = [];
  casPlans?: CasPlan[] = [];

  cols = [
    {
      field: "name",
      header: "Name",
      sort: true,
    },
    {
      field: "number",
      header: "Number",
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
  cas_assessment_category_version_id!: number;
  cas_plan_content_id!: number;
  cas_plan_id!: number;

  constructor(
    protected casAssessmentCriteriaOptionService: CasAssessmentCriteriaOptionService,
    protected casAssessmentCategoryVersionService: CasAssessmentCategoryVersionService,
    protected casPlanContentService: CasPlanContentService,
    protected casPlanService: CasPlanService,
    protected activatedRoute: ActivatedRoute,
    protected localStorageService: LocalStorageService,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casPlanService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasPlan[]>) =>
          (this.casPlans = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if ( !this.cas_plan_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.casAssessmentCriteriaOptionService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        cas_plan_id: this.cas_plan_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<CasAssessmentCriteriaOption[]>) => {
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
   * Creating or updating CasAssessmentCriteriaOption
   * @param casAssessmentCriteriaOption ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(
    casAssessmentCriteriaOption?: CasAssessmentCriteriaOption
  ): void {
    const data: CasAssessmentCriteriaOption = casAssessmentCriteriaOption ?? {
      ...new CasAssessmentCriteriaOption(),
      cas_plan_id: this.cas_plan_id,
    };
    const ref = this.dialogService.open(
      CasAssessmentCriteriaOptionUpdateComponent,
      {
        data,
        header: "Create/Update CasAssessmentCriteriaOption",
      }
    );
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete CasAssessmentCriteriaOption
   * @param casAssessmentCriteriaOption
   */
  delete(casAssessmentCriteriaOption: CasAssessmentCriteriaOption): void {
    this.confirmationService.confirm({
      message:
        "Are you sure that you want to delete this CasAssessmentCriteriaOption?",
      accept: () => {
        this.casAssessmentCriteriaOptionService
          .delete(casAssessmentCriteriaOption.id!)
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
    resp: CustomResponse<CasAssessmentCriteriaOption[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/cas-assessment-criteria-option"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.casAssessmentCriteriaOptions = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Cas Assessment Criteria Option");
  }

  loadContents() {
    //initialaize nodes array
    this.nodes = [];
    this.casAssessmentCriteriaOptionService.loadContents(this.cas_assessment_category_version_id)
      .subscribe((resp)=>{
        this.casPlanContents = resp.data;
        if (this.casPlanContents.length > 0) {
          for (let i = 0; i < this.casPlanContents!.length; i++) {
            this.nodes.push({
              label: this.casPlanContents[i].name,
              data: {id:this.casPlanContents[i].id,name: this.casPlanContents[i].name},
              children: [],
              leaf: false,
            });
          }
          this.selectedValue = this.nodes[0];
          this.onSelectionChange();
        }
      });
  }
  nodeExpand(event: any): any {
    let selected: TreeNode = event.node;
    this.treeLoading = true;
    this.casPlanContentService
      .query({
        parent_id: selected.data.id,
        columns: ['id', 'name'],
      })
      .subscribe(
        (resp) => {
          this.treeLoading = false;
          selected.children = resp.data?.map((a) => {
            return {
              label: a.name,
              data: a,
              leaf: false,
            };
          });
        },
        (error) => {
          this.treeLoading = false;
        }
      );
  }

  onSelectionChange(event?: any): void {
    const selection =
      typeof this.selectedValue === 'object'
        ? this.returnType === 'object'
          ? this.selectedValue?.data
          : this.selectedValue?.data?.id
        : this.selectedValue?.data?.map((d: CasPlanContent) => {
          return this.returnType === 'object' ? d : d.id;
        });
    this.onSelect.next(selection);
    this.panel.hide();
    this.localStorageService.store(`${this.stateKey}_selected`, {
      label: this.selectedValue.label,
      data: this.selectedValue.data,
      leaf: this.selectedValue.leaf,
    });
    this.cas_plan_content_id = this.selectedValue?.data?.id;
    this.loadPage();
  }
}
