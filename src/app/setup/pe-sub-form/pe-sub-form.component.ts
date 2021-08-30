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
import { PeForm } from "src/app/setup/pe-form/pe-form.model";
import { PeFormService } from "src/app/setup/pe-form/pe-form.service";

import { PeSubForm } from "./pe-sub-form.model";
import { PeSubFormService } from "./pe-sub-form.service";
import { PeSubFormUpdateComponent } from "./update/pe-sub-form-update.component";

@Component({
  selector: "app-pe-sub-form",
  templateUrl: "./pe-sub-form.component.html",
})
export class PeSubFormComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  peSubForms?: PeSubForm[] = [];

  peForms?: PeForm[] = [];

  cols = [

    {
      field: "name",
      header: "Name",
      sort: true,
    },
    {
      field: "parent_id",
      header: "Parent ",
      sort: true,
    },
    {
      field: "code",
      header: "Code",
      sort: true,
    },
    // {
    //   field: "is_lowest",
    //   header: "Is Lowest",
    //   sort: false,
    // },
    // {
    //   field: "sort_order",
    //   header: "Sort Order",
    //   sort: false,
    // },
    // {
    //   field: "is_multiple",
    //   header: "Is Multiple",
    //   sort: false,
    // },
    // {
    //   field: "is_active",
    //   header: "Is Active",
    //   sort: false,
    // },
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
  pe_form_id!: number;

  constructor(
    protected peSubFormService: PeSubFormService,
    protected peFormService: PeFormService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.peSubFormService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<PeSubForm[]>) => (this.peSubForms = resp.data)
      );
    this.peFormService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<PeForm[]>) => (this.peForms = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.pe_form_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.peSubFormService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        pe_form_id: this.pe_form_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<PeSubForm[]>) => {
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
   * Creating or updating PeSubForm
   * @param peSubForm ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(peSubForm?: PeSubForm): void {
    const data: PeSubForm = peSubForm ?? {
      ...new PeSubForm(),
      pe_form_id: this.pe_form_id,
    };
    const ref = this.dialogService.open(PeSubFormUpdateComponent, {
      data,
      header: "Create/Update PeSubForm",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete PeSubForm
   * @param peSubForm
   */
  delete(peSubForm: PeSubForm): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this PeSubForm?",
      accept: () => {
        this.peSubFormService.delete(peSubForm.id!).subscribe((resp) => {
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
    resp: CustomResponse<PeSubForm[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/pe-sub-form"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.peSubForms = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Pe Sub Form");
  }
}
