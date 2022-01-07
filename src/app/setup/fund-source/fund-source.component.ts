/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
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
import { GfsCode } from "src/app/setup/gfs-code/gfs-code.model";
import { GfsCodeService } from "src/app/setup/gfs-code/gfs-code.service";
import { FundSourceCategory } from "src/app/setup/fund-source-category/fund-source-category.model";
import { FundSourceCategoryService } from "src/app/setup/fund-source-category/fund-source-category.service";

import { FundSource } from "./fund-source.model";
import { FundSourceService } from "./fund-source.service";
import { FundSourceUpdateComponent } from "./update/fund-source-update.component";
import {UploadComponent} from "./upload/upload.component";
import {Sector} from "../sector/sector.model";
import {FormBuilder, Validators} from "@angular/forms";
import {BudgetClassService} from "../budget-class/budget-class.service";
import {FundSourceBudgetClassService} from "../fund-source-budget-class/fund-source-budget-class.service";
import {SectorService} from "../sector/sector.service";
import {finalize} from "rxjs/operators";

@Component({
  selector: "app-fund-source",
  templateUrl: "./fund-source.component.html",
})
export class FundSourceComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  @ViewChild('overlayOpening')
  overlayTarget: ElementRef | undefined;
  selectedFundSource?:FundSource={};
  positionLeft = '0%';
  positionTop = '0px';
  marginStyle = { 'margin-left': this.positionLeft, 'margin-top': this.positionTop };
  fundSources?: FundSource[] = [];

  gfsCodes?: GfsCode[] = [];
  fundSourceCategories?: FundSourceCategory[] = [];

  fundSourcesBudgetClasses?: any[] = [];
  budgetClasses?: SelectItemGroup[];

  budgetClassIds?: any[] = [];
  sectors?: Sector[] = [];
  selectedSectors?: any[] = [];
  fundSourceBudgetClassForm = this.fb.group({
    fund_source_id: [null, []],
    budget_Classes: [null, [Validators.required]],
    budget_class_id:[null, []],
    ceiling_name:[null, []],
    sectors:[null,[]]
  });

  cols = [
    {
      field: "name",
      header: "Name",
      sort: true,
    },
    {
      field: "code",
      header: "Code",
      sort: true,
    },
    {
      field: "is_conditional",
      header: "Conditional",
      sort: false,
    },
    {
      field: "is_foreign",
      header: "Foreign",
      sort: false,
    },
    {
      field: "is_treasurer",
      header: "Treasury",
      sort: false,
    },
    {
      field: "can_project",
      header: "Can Project",
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
  gfs_code_id!: number;
  fund_source_category_id!: number;

  constructor(
    protected fb: FormBuilder,
    protected fundSourceService: FundSourceService,
    protected gfsCodeService: GfsCodeService,
    protected fundSourceCategoryService: FundSourceCategoryService,
    private fundSourceBudgetClassService : FundSourceBudgetClassService,
    protected sectorService: SectorService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    private budgetClassService: BudgetClassService,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.gfsCodeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<GfsCode[]>) => (this.gfsCodes = resp.data)
      );
    this.fundSourceCategoryService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundSourceCategory[]>) =>
          (this.fundSourceCategories = resp.data)
      );
    this.handleNavigation();
    this.loadPage();
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
    this.fundSourceService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<FundSource[]>) => {
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
   * Creating or updating FundSource
   * @param fundSource ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(fundSource?: FundSource): void {
    const data: FundSource = fundSource ?? {
      ...new FundSource(),
      gfs_code_id: this.gfs_code_id,
      fund_source_category_id: this.fund_source_category_id,
    };
    const ref = this.dialogService.open(FundSourceUpdateComponent, {
      data,
      header: "Create/Update FundSource",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete FundSource
   * @param fundSource
   */
  delete(fundSource: FundSource): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this FundSource?",
      accept: () => {
        this.fundSourceService.delete(fundSource.id!).subscribe((resp) => {
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
    resp: CustomResponse<FundSource[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/fund-source"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.fundSources = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Fund Source");
  }

  upload(): void {
    const ref = this.dialogService.open(UploadComponent, {
      width: '60%',
      header: 'Fund Source Upload Form'
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  loadGfsCode(event:Event,gfs:any,fund_source:FundSource): void {
    this.selectedFundSource = fund_source;
    let aggregatedCode = fund_source.gfs_code!.code;
    this.gfsCodeService
      .query({aggregated_code:aggregatedCode,page:1,per_page:1000})
      .subscribe(
        (res: CustomResponse<GfsCode[]>) => {
          this.gfsCodes = res?.data ?? [];
        });
    gfs.toggle(event,this.overlayTarget?.nativeElement)
  }
  loadBudgetClasses(event: Event,bc:any,fundSource:FundSource) : void{
    this.selectedFundSource = fundSource;
    bc.toggle(event,this.overlayTarget?.nativeElement)
    this.selectedSectors = [];
    this.budgetClassService.getParentChild().subscribe(
      (resp: CustomResponse<any[]>) => (this.budgetClasses = resp.data));
    this.sectorService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
      );
    this.fundSourceBudgetClassService
      .query({fund_source_id: this.selectedFundSource!.id,page:1})
      .subscribe(
        (res: CustomResponse<FundSource[]>) => {
          this.fundSourcesBudgetClasses = res?.data ?? [];
          this.budgetClassIds = this.fundSourcesBudgetClasses?.map((budgetClasses: { budget_class: any; })=>budgetClasses.budget_class.id);
          this.fundSourceBudgetClassForm.get(["budget_Classes"])?.setValue(this.budgetClassIds);
          for (let ceiling of this.fundSourcesBudgetClasses) {
            this.fundSourceService
              .queryCeilingSector({ceiling_id:ceiling.id,page:1})
              .subscribe(
                (res: CustomResponse<any[]>) => {
                  let sectors = (res?.data ?? [])?.map((sectors: { sector: any; })=>sectors.sector.id);
                  this.selectedSectors=this.selectedSectors?.concat(sectors);
                  this.fundSourceBudgetClassForm.get(["sectors"])?.setValue(this.selectedSectors?.filter((item,index) => this.selectedSectors?.indexOf(item) === index));
                });
          }
        }
      );
  }

  saveBudgetClass(): void{
    this.fundSourceBudgetClassForm.get(["fund_source_id"])?.setValue(this.selectedFundSource!.id);
    this.fundSourceBudgetClassForm.get(["ceiling_name"])?.setValue(this.selectedFundSource!.gfs_code!.name);
    this.fundSourceBudgetClassForm.get(["budget_class_id"])?.setValue(2);

    if(this.fundSourceBudgetClassForm.get(["budget_Classes"])?.value.length == 0){
      this.toastService.info('Nothing to save');
      return;
    }
    if (this.fundSourceBudgetClassForm.invalid) {
      return;
    }
    this.subscribeToSaveResponse(this.fundSourceBudgetClassService.create(this.fundSourceBudgetClassForm.value));
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FundSource>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
  }
}

