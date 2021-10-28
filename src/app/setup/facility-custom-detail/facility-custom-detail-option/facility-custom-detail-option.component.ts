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

import {FacilityCustomDetailOption} from "./facility-custom-detail-option.model";
import {FacilityCustomDetailOptionService} from "./facility-custom-detail-option.service";
import {FacilityCustomDetailOptionUpdateComponent} from "./update/facility-custom-detail-option-update.component";

@Component({
  selector: "app-facility-custom-detail-option",
  templateUrl: "./facility-custom-detail-option.component.html",
})
export class FacilityCustomDetailOptionComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  facilityCustomDetailOptions?: FacilityCustomDetailOption[] = [];
  facilityCustomDetail!: FacilityCustomDetail;
  cols = [
    {
      field: "value",
      header: "Value",
      sort: false,
    },
    {
      field: "label",
      header: "Label",
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

  constructor(
    protected facilityCustomDetailOptionService: FacilityCustomDetailOptionService,
    protected facilityCustomDetailService: FacilityCustomDetailService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
  ) {
    this.facilityCustomDetail = this.dialogConfig.data.facilityCustomDetail;
  }

  ngOnInit(): void {
    this.loadPage();
  }

  /**
   * Load data from api
   * @param page = page number
   */
  loadPage(page?: number): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.facilityCustomDetailOptionService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        facility_custom_detail_id: this.facilityCustomDetail.id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<FacilityCustomDetailOption[]>) => {
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
   * Creating or updating FacilityCustomDetailOption
   * @param facilityCustomDetailOption ; If undefined initialize new model to create else edit existing model
   */
  create(): void {
    const data = {
      facilityCustomDetail: this.facilityCustomDetail
    };
    const ref = this.dialogService.open(
      FacilityCustomDetailOptionUpdateComponent,
      {
        data,
        header: "Create Option",
      }
    );
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  update(facilityCustomDetailOption?: FacilityCustomDetailOption): void {
    const data = {
      facilityCustomDetail: this.facilityCustomDetail,
      facilityCustomDetailOption: facilityCustomDetailOption
    };
    const ref = this.dialogService.open(
      FacilityCustomDetailOptionUpdateComponent,
      {
        data,
        header: "Update Option",
      }
    );
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete FacilityCustomDetailOption
   * @param facilityCustomDetailOption
   */
  delete(facilityCustomDetailOption: FacilityCustomDetailOption): void {
    this.confirmationService.confirm({
      message:
        "Are you sure that you want to delete this Option?",
      accept: () => {
        this.facilityCustomDetailOptionService
          .delete(facilityCustomDetailOption.id!)
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
   */
  protected onSuccess(
    resp: CustomResponse<FacilityCustomDetailOption[]> | null,
    page: number,
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    this.facilityCustomDetailOptions = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Facility Custom Detail Option");
  }
}
