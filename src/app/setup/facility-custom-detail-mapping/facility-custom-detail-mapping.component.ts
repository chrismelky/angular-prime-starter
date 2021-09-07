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
import { EnumService, PlanrepEnum } from "src/app/shared/enum.service";
import { FacilityCustomDetail } from "src/app/setup/facility-custom-detail/facility-custom-detail.model";
import { FacilityCustomDetailService } from "src/app/setup/facility-custom-detail/facility-custom-detail.service";
import { FacilityType } from "src/app/setup/facility-type/facility-type.model";
import { FacilityTypeService } from "src/app/setup/facility-type/facility-type.service";

import { FacilityCustomDetailMapping } from "./facility-custom-detail-mapping.model";
import { FacilityCustomDetailMappingService } from "./facility-custom-detail-mapping.service";
import { FacilityCustomDetailMappingUpdateComponent } from "./update/facility-custom-detail-mapping-update.component";

@Component({
  selector: "app-facility-custom-detail-mapping",
  templateUrl: "./facility-custom-detail-mapping.component.html",
})
export class FacilityCustomDetailMappingComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  facilityCustomDetailMappings?: FacilityCustomDetailMapping[] = [];

  facilityCustomDetails?: FacilityCustomDetail[] = [];
  facilityTypes?: FacilityType[] = [];
  ownerships?: PlanrepEnum[] = [];

  cols = [
    {
      field: "ownership",
      header: "Ownership",
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
  facility_type_id!: number;

  constructor(
    protected facilityCustomDetailMappingService: FacilityCustomDetailMappingService,
    protected facilityCustomDetailService: FacilityCustomDetailService,
    protected facilityTypeService: FacilityTypeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.facilityCustomDetailService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FacilityCustomDetail[]>) =>
          (this.facilityCustomDetails = resp.data)
      );
    this.facilityTypeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FacilityType[]>) =>
          (this.facilityTypes = resp.data)
      );
    this.ownerships = this.enumService.get("ownerships");
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.facility_type_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.facilityCustomDetailMappingService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        facility_type_id: this.facility_type_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<FacilityCustomDetailMapping[]>) => {
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
   * Creating or updating FacilityCustomDetailMapping
   * @param facilityCustomDetailMapping ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(
    facilityCustomDetailMapping?: FacilityCustomDetailMapping
  ): void {
    const data: FacilityCustomDetailMapping = facilityCustomDetailMapping ?? {
      ...new FacilityCustomDetailMapping(),
      facility_type_id: this.facility_type_id,
    };
    const ref = this.dialogService.open(
      FacilityCustomDetailMappingUpdateComponent,
      {
        data,
        header: "Create/Update FacilityCustomDetailMapping",
      }
    );
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete FacilityCustomDetailMapping
   * @param facilityCustomDetailMapping
   */
  delete(facilityCustomDetailMapping: FacilityCustomDetailMapping): void {
    this.confirmationService.confirm({
      message:
        "Are you sure that you want to delete this FacilityCustomDetailMapping?",
      accept: () => {
        this.facilityCustomDetailMappingService
          .delete(facilityCustomDetailMapping.id!)
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
    resp: CustomResponse<FacilityCustomDetailMapping[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/facility-custom-detail-mapping"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.facilityCustomDetailMappings = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Facility Custom Detail Mapping");
  }
}
