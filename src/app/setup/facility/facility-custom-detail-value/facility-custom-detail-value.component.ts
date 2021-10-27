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
import {FacilityCustomDetail} from "src/app/setup/facility-custom-detail/facility-custom-detail.model";
import {FacilityCustomDetailService} from "src/app/setup/facility-custom-detail/facility-custom-detail.service";

import {FacilityCustomDetailValue} from "./facility-custom-detail-value.model";
import {FacilityCustomDetailValueService} from "./facility-custom-detail-value.service";
import {FacilityCustomDetailValueUpdateComponent} from "./update/facility-custom-detail-value-update.component";
import {Facility} from "../facility.model";

@Component({
  selector: "app-facility-custom-detail-value",
  templateUrl: "./facility-custom-detail-value.component.html",
})
export class FacilityCustomDetailValueComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  facilityCustomDetailValues?: FacilityCustomDetailValue[] = [];
  facility!: Facility
  facilityCustomDetails?: FacilityCustomDetail[] = [];

  cols = [
    {
      field: "value",
      header: "Value",
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
  facilityTypeId: number | undefined;
  ownership: string | undefined;

  //Mandatory filter

  constructor(
    protected facilityCustomDetailValueService: FacilityCustomDetailValueService,
    protected facilityCustomDetailService: FacilityCustomDetailService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {
    this.facility = this.dialogConfig.data.facility;
    this.facilityTypeId = this.facility?.facility_type?.id
    this.ownership = this.facility?.ownership;
  }

  ngOnInit(): void {
    this.loadPage();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.facilityCustomDetailValueService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        facility_id: this.facility.id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<FacilityCustomDetailValue[]>) => {
          this.isLoading = false;
          this.onSuccess(res, pageToLoad);
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
   * When page changed
   * @param event page event
   */
  pageChanged(event: any): void {
    this.page = event.page + 1;
    this.per_page = event.rows!;
    this.loadPage();
  }

  /**
   * Creating or updating FacilityCustomDetailValue
   * @param facilityCustomDetailValue ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(facilityCustomDetailValue?: FacilityCustomDetailValue): void {
    const data = {
      facilityCustomDetailValue: facilityCustomDetailValue ? facilityCustomDetailValue : undefined,
      facility: this.facility
    }
    const ref = this.dialogService.open(
      FacilityCustomDetailValueUpdateComponent,
      {
        data,
        header: "Create/Update FacilityCustomDetailValue",
      }
    );
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete FacilityCustomDetailValue
   * @param facilityCustomDetailValue
   */
  delete(facilityCustomDetailValue: FacilityCustomDetailValue): void {
    this.confirmationService.confirm({
      message:
        "Are you sure that you want to delete this FacilityCustomDetailValue?",
      accept: () => {
        this.facilityCustomDetailValueService
          .delete(facilityCustomDetailValue.id!)
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
    resp: CustomResponse<FacilityCustomDetailValue[]> | null,
    page: number,
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    this.facilityCustomDetailValues = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Facility Custom Detail Value");
  }
}
