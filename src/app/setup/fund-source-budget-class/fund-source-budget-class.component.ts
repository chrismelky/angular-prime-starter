/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {combineLatest, Observable} from "rxjs";
import {ConfirmationService, LazyLoadEvent, MenuItem, SelectItemGroup} from "primeng/api";
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
import { BudgetClassService } from "src/app/setup/budget-class/budget-class.service";
import { FundSource } from "src/app/setup/fund-source/fund-source.model";
import { FundSourceService } from "src/app/setup/fund-source/fund-source.service";
import { FundType } from "src/app/setup/fund-type/fund-type.model";
import { FundTypeService } from "src/app/setup/fund-type/fund-type.service";
import { BankAccount } from "src/app/setup/bank-account/bank-account.model";
import { BankAccountService } from "src/app/setup/bank-account/bank-account.service";

import { FundSourceBudgetClass } from "./fund-source-budget-class.model";
import { FundSourceBudgetClassService } from "./fund-source-budget-class.service";
import { FundSourceBudgetClassUpdateComponent } from "./update/fund-source-budget-class-update.component";
import {finalize} from "rxjs/operators";

@Component({
  selector: "app-fund-source-budget-class",
  templateUrl: "./fund-source-budget-class.component.html",
})
export class FundSourceBudgetClassComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  fundSourceBudgetClasses?: FundSourceBudgetClass[] = [];

  budgetClasses?: SelectItemGroup[];
  fundSources?: FundSource[] = [];
  fundTypes?: FundType[] = [];
  bankAccounts?: BankAccount[] = [];

  cols = [
    {
      field: "ceiling_name",
      header: "Ceiling Name",
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

  constructor(
    protected fundSourceBudgetClassService: FundSourceBudgetClassService,
    protected budgetClassService: BudgetClassService,
    protected fundSourceService: FundSourceService,
    protected fundTypeService: FundTypeService,
    protected bankAccountService: BankAccountService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    // this.budgetClassService
    //   .query({ columns: ["id", "name"] })
    //   .subscribe(
    //     (resp: CustomResponse<BudgetClass[]>) =>
    //       (this.budgetClasses = resp.data)
    //   );
    this.budgetClassService.getParentChild().subscribe(
      (resp: CustomResponse<any[]>) => (this.budgetClasses = resp.data));
    this.fundSourceService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data)
      );
    this.fundTypeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundType[]>) => (this.fundTypes = resp.data)
      );
    this.bankAccountService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<BankAccount[]>) => (this.bankAccounts = resp.data)
      );
    this.handleNavigation();
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
    this.fundSourceBudgetClassService
      .queryCeilingsChild({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<FundSourceBudgetClass[]>) => {
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
      this.loadPage(this.page, true);
    });
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
   * Creating or updating FundSourceBudgetClass
   * @param fundSourceBudgetClass ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(fundSourceBudgetClass?: FundSourceBudgetClass): void {
    const data: FundSourceBudgetClass = fundSourceBudgetClass ?? {
      ...new FundSourceBudgetClass(),
    };
    const ref = this.dialogService.open(FundSourceBudgetClassUpdateComponent, {
      data,
      header: "Create/Update FundSourceBudgetClass",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete FundSourceBudgetClass
   * @param fundSourceBudgetClass
   */
  delete(fundSourceBudgetClass: FundSourceBudgetClass): void {
    this.confirmationService.confirm({
      message:
        "Are you sure that you want to delete this FundSourceBudgetClass?",
      accept: () => {
        this.fundSourceBudgetClassService
          .delete(fundSourceBudgetClass.id!)
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
    resp: CustomResponse<FundSourceBudgetClass[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/fund-source-budget-class"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.fundSourceBudgetClasses = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Fund Source Budget Class");
  }

  /**
   * this activate deactivate ceilings
   */
  toggleActivation(row :any): void{
    const fundSourceBudgetClass = this.createFromForm(row);
    this.subscribeToSaveResponse(
      this.fundSourceBudgetClassService.update(fundSourceBudgetClass)
    );
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FundSourceBudgetClass>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
  }


  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.loadPage();
  }

  /**
   * Return form values as object of type FundSourceBudgetClass
   * @returns FundSourceBudgetClass
   */
  protected createFromForm(row:any): FundSourceBudgetClass {
    return {
      ...new FundSourceBudgetClass(),
      id: row.id,
      ceiling_name:row.ceiling_name,
      budget_class_id: row.budget_class_id,
      fund_source_id:row.fund_source_id,
      fund_type_id:row.fund_type_id,
      bank_account_id:row.bank_account_id,
      is_active:row.is_active
    };
  }
}
