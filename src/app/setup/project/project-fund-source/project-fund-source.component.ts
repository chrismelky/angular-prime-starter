/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, LazyLoadEvent, MenuItem} from "primeng/api";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Paginator} from "primeng/paginator";
import {Table} from "primeng/table";
import {FundSource} from "../../fund-source/fund-source.model";
import {ToastService} from "../../../shared/toast.service";
import {ITEMS_PER_PAGE, PER_PAGE_OPTIONS} from "../../../config/pagination.constants";
import {HelperService} from "../../../utils/helper.service";
import {ProjectService} from "../project.service";
import {ProjectFundSource} from "../../project-fund-source/project-fund-source.model";
import {Project} from "../project.model";
import {ProjectFundSourceService} from "../../project-fund-source/project-fund-source.service";
import {FundSourceService} from "../../fund-source/fund-source.service";
import {CustomResponse} from "../../../utils/custom-response";
import {CreateComponent} from "./create/create.component";
import {ProjectFundSourceUpdateComponent} from "./update/project-fund-source-update.component";

@Component({
  selector: "app-project-fund-source",
  templateUrl: "./project-fund-source.component.html",
})
export class ProjectFundSourceComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  projectFundSources?: ProjectFundSource[] = [];

  projects?: Project[] = [];
  fundSources?: FundSource[] = [];

  cols = []; //Table display columns

  isLoading = false;
  page: number = 1;
  perPage: number = 15;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects

  //Mandatory filter
  project!: Project;

  constructor(
    protected projectFundSourceService: ProjectFundSourceService,
    protected projectService: ProjectService,
    protected fundSourceService: FundSourceService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected toastService: ToastService
  ) {
    this.project = this.dialogConfig.data.project;
  }

  ngOnInit(): void {
    this.projectService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<Project[]>) => (this.projects = resp.data)
      );
    this.fundSourceService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.project.id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.perPage = this.perPage ?? ITEMS_PER_PAGE;
    this.projectFundSourceService
      .query({
        page: pageToLoad,
        per_page: this.perPage,
        sort: this.sort(),
        project_id: this.project.id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<ProjectFundSource[]>) => {
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
    const page = this.page;
    const perPage = this.perPage;
    this.perPage = perPage !== null ? perPage : ITEMS_PER_PAGE;
    this.page = page !== null ? page : 1;
    this.loadPage(this.page, true);
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
    this.perPage = event.rows!;
    this.loadPage();
  }

  /**
   * Impletement sorting Set/Reurn the sorting option for data
   * @returns default ot id sorting
   */
  protected sort(): string[] {
    const predicate = this.predicate ? this.predicate : "id";
    const direction = this.ascending ? "asc" : "desc";
    return [`${predicate}:${direction}`];
  }

  create(): void {
    const data = {
      project: this.project
    }
    const ref = this.dialogService.open(CreateComponent, {
      data,
      header: this.project.name + ' Fund Source Mapping Form',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  edit(row: ProjectFundSource): void {
    const data = {
      projectFundSource: row,
      project: this.project
    }
    const ref = this.dialogService.open(ProjectFundSourceUpdateComponent, {
      data,
      header: "Update Project Fund Source",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete ProjectFundSource
   * @param projectFundSource
   */
  delete(projectFundSource: ProjectFundSource): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this ProjectFundSource?",
      accept: () => {
        this.projectFundSourceService
          .delete(projectFundSource.id!)
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
    resp: CustomResponse<ProjectFundSource[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    this.projectFundSources = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Project Fund Source");
  }
}
