/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {combineLatest} from "rxjs";
import {ConfirmationService, LazyLoadEvent, MenuItem} from "primeng/api";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Paginator} from "primeng/paginator";
import {Table} from "primeng/table";

import {CustomResponse} from "../../../utils/custom-response";
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "../../../config/pagination.constants";
import {HelperService} from "src/app/utils/helper.service";
import {ToastService} from "src/app/shared/toast.service";
import {GfsCode} from "src/app/setup/gfs-code/gfs-code.model";
import {GfsCodeService} from "src/app/setup/gfs-code/gfs-code.service";
import {Section} from "src/app/setup/section/section.model";
import {SectionService} from "src/app/setup/section/section.service";

import {GfsCodeSection} from "./gfs-code-section.model";
import {GfsCodeSectionService} from "./gfs-code-section.service";
import {GfsCodeSectionUpdateComponent} from "./update/gfs-code-section-update.component";
import {CreateComponent} from "./create/create.component";

@Component({
  selector: "app-gfs-code-section",
  templateUrl: "./gfs-code-section.component.html",
})
export class GfsCodeSectionComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  gfsCodeSections?: GfsCodeSection[] = [];

  gfsCodes?: GfsCode[] = [];
  sections?: Section[] = [];

  cols = []; //Table display columns

  isLoading = false;
  page?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects
  gfsCode!: GfsCode;

  //Mandatory filter

  constructor(
    protected gfsCodeSectionService: GfsCodeSectionService,
    protected gfsCodeService: GfsCodeService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
  ) {
    this.gfsCode = this.dialogConfig.data.gfsCode;
  }

  ngOnInit(): void {
    this.sectionService
      .query({columns: ["id", "name", "code"]})
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    this.loadPage(this.page, true);
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.gfsCodeSectionService
      .query({
        gfs_code_id: this.gfsCode.id,
        page: pageToLoad,
        per_page: this.per_page
      })
      .subscribe(
        (res: CustomResponse<GfsCodeSection[]>) => {
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
   * Creating or updating GfsCodeSection
   */
  create(): void {
    const data = {
      gfsCode: this.gfsCode,
    }
    const ref = this.dialogService.open(CreateComponent, {
      data,
      header: "Create GFS Code Planning Units",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  update(gfsCodeSection: GfsCodeSection): void {
    const data = {
      gfsCode: this.gfsCode,
      gfsCodeSection: gfsCodeSection
    }
    const ref = this.dialogService.open(GfsCodeSectionUpdateComponent, {
      data,
      header: "Update GFS Code Planning Unit",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete GfsCodeSection
   * @param gfsCodeSection
   */
  delete(gfsCodeSection: GfsCodeSection): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this GfsCodeSection?",
      accept: () => {
        this.gfsCodeSectionService
          .delete(gfsCodeSection.id!)
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
    resp: CustomResponse<GfsCodeSection[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    this.gfsCodeSections = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Gfs Code Section");
  }
}
