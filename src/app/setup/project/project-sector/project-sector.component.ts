/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, LazyLoadEvent, MenuItem } from "primeng/api";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import { Paginator } from "primeng/paginator";
import { Table } from "primeng/table";
import {Project} from "../project.model";
import {ProjectSectorService} from "../../project-sector/project-sector.service";
import {ToastService} from "../../../shared/toast.service";
import {Sector} from "../../sector/sector.model";
import {ITEMS_PER_PAGE, PER_PAGE_OPTIONS} from "../../../config/pagination.constants";
import {SectorService} from "../../sector/sector.service";
import {ProjectSector} from "../../project-sector/project-sector.model";
import {HelperService} from "../../../utils/helper.service";
import {ProjectService} from "../project.service";
import {CustomResponse} from "../../../utils/custom-response";
import {ProjectSectorUpdateComponent} from "./update/project-sector-update.component";
import {CreateComponent} from "./create/create.component";

@Component({
  selector: "app-project-sector",
  templateUrl: "./project-sector.component.html",
})
export class ProjectSectorComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  projectSectors?: ProjectSector[] = [];

  projects?: Project[] = [];
  sectors?: Sector[] = [];

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
    protected projectSectorService: ProjectSectorService,
    protected projectService: ProjectService,
    protected sectorService: SectorService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
  ) {
    this.project = this.dialogConfig.data.project;
  }

  ngOnInit(): void {
    this.projectService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Project[]>) => (this.projects = resp.data)
      );
    this.sectorService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
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
    this.projectSectorService
      .query({
        page: pageToLoad,
        per_page: this.perPage,
        sort: this.sort(),
        project_id: this.project.id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<ProjectSector[]>) => {
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
   * Called onInit to
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
   * Impletement sorting Set/Return the sorting option for data
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
      header: "Create Project Sector",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  edit(row: ProjectSector): void {
    const data = {
      project: this.project,
      projectSector: row,
    }
    const ref = this.dialogService.open(ProjectSectorUpdateComponent, {
      data,
      header: "Update Project Sector",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete ProjectSector
   * @param projectSector
   */
  delete(projectSector: ProjectSector): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this ProjectSector?",
      accept: () => {
        this.projectSectorService
          .delete(projectSector.id!)
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
    resp: CustomResponse<ProjectSector[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    this.projectSectors = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Project Sector");
  }
}
