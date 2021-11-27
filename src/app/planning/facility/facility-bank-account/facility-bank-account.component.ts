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
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import { Paginator } from "primeng/paginator";
import { Table } from "primeng/table";

import { CustomResponse } from "../../../utils/custom-response";
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "../../../config/pagination.constants";
import { HelperService } from "src/app/utils/helper.service";
import { ToastService } from "src/app/shared/toast.service";
import { Facility } from "src/app/setup/facility/facility.model";
import { FacilityService } from "src/app/setup/facility/facility.service";

import { FacilityBankAccount } from "./facility-bank-account.model";
import { FacilityBankAccountService } from "./facility-bank-account.service";
import { FacilityBankAccountUpdateComponent } from "./update/facility-bank-account-update.component";

@Component({
  selector: "app-facility-bank-account",
  templateUrl: "./facility-bank-account.component.html",
})
export class FacilityBankAccountComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  facilityBankAccounts?: FacilityBankAccount[] = [];
  cols = [
    {
      field: "bank",
      header: "Bank",
      sort: false,
    },
    {
      field: "branch",
      header: "Branch",
      sort: false,
    },
    {
      field: "account_name",
      header: "Account Name",
      sort: false,
    },
    {
      field: "account_number",
      header: "Account Number",
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
  facility!: Facility;

  constructor(
    protected facilityBankAccountService: FacilityBankAccountService,
    protected facilityService: FacilityService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected toastService: ToastService
  ) {
    this.facility = this.dialogConfig.data.facility;
  }

  ngOnInit(): void {
    this.loadPage();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.facility.id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.facilityBankAccountService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        facility_id: this.facility.id
      })
      .subscribe(
        (res: CustomResponse<FacilityBankAccount[]>) => {
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
   * When page changed
   * @param event page event
   */
  pageChanged(event: any): void {
    this.page = event.page + 1;
    this.per_page = event.rows!;
    this.loadPage();
  }

  /**
   * Creating or updating FacilityBankAccount
   * @param facilityBankAccount ; If undefined initialize new model to create else edit existing model
   */
  createOrUpdate(facilityBankAccount?: FacilityBankAccount): void {
    const data: FacilityBankAccount = facilityBankAccount ?? {
      ...new FacilityBankAccount(),
      facility_id: this.facility.id,
    };
    const ref = this.dialogService.open(FacilityBankAccountUpdateComponent, {
      data,
      header: "Create/Update Facility Bank Account",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete FacilityBankAccount
   * @param facilityBankAccount
   */
  delete(facilityBankAccount: FacilityBankAccount): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this Facility Bank Account?",
      accept: () => {
        this.facilityBankAccountService
          .delete(facilityBankAccount.id!)
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
    resp: CustomResponse<FacilityBankAccount[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    this.facilityBankAccounts = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Facility Bank Account");
  }
}
