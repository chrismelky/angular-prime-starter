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
import {ConfirmationService, LazyLoadEvent, MenuItem, TreeNode} from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { Paginator } from "primeng/paginator";

import { CustomResponse } from "../../utils/custom-response";
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "../../config/pagination.constants";
import { HelperService } from "src/app/utils/helper.service";
import { ToastService } from "src/app/shared/toast.service";
import { EnumService, PlanrepEnum } from "src/app/shared/enum.service";
import { GfsCode } from "src/app/setup/gfs-code/gfs-code.model";
import { GfsCodeService } from "src/app/setup/gfs-code/gfs-code.service";
import { PeForm } from "src/app/setup/pe-form/pe-form.model";
import { PeFormService } from "src/app/setup/pe-form/pe-form.service";

import { PeDefinition } from "./pe-definition.model";
import { PeDefinitionService } from "./pe-definition.service";
import { PeDefinitionUpdateComponent } from "./update/pe-definition-update.component";
import {NationalReference} from "../national-reference/national-reference.model";
import {finalize} from "rxjs/operators";
import {TreeTable} from "primeng/treetable";
import {PeSelectOption} from "../pe-select-option/pe-select-option.model";

@Component({
  selector: "app-pe-definition",
  templateUrl: "./pe-definition.component.html",
})
export class PeDefinitionComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: TreeTable;
  peDefinitions?: PeDefinition[] = [];
  peDefinitionsNodeTree?: TreeNode[] = [];

  parents?: PeDefinition[] = [];
  gfsCodes?: GfsCode[] = [];
  peForms?: PeForm[] = [];
  units?: PlanrepEnum[] = [];
  valueTypes?: PlanrepEnum[] = [];
  peSelectOption?: PeSelectOption[] = [];

  cols = [
    {
      field: "field_name",
      header: "Field Name",
      sort: true,
    }
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
    protected peDefinitionService: PeDefinitionService,
    protected gfsCodeService: GfsCodeService,
    protected peFormService: PeFormService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.peDefinitionService
      .query({ columns: ["id", "field_name"] })
      .subscribe(
        (resp: CustomResponse<PeDefinition[]>) => (this.parents = resp.data)
      );
    this.gfsCodeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<GfsCode[]>) => (this.gfsCodes = resp.data)
      );
    this.peFormService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<PeForm[]>) => (this.peForms = resp.data)
      );

    this.units = this.enumService.get("units");
    this.valueTypes = this.enumService.get("valueTypes");
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.pe_form_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.peDefinitionService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        pe_form_id: this.pe_form_id,
        parent_id: null,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<PeDefinition[]>) => {
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
   * Creating or updating PeDefinition
   * @param peDefinition ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(peDefinition?: PeDefinition): void {
    const data: PeDefinition = peDefinition ?? {
      ...new PeDefinition(),
      pe_form_id: this.pe_form_id,
    };
    const ref = this.dialogService.open(PeDefinitionUpdateComponent, {
      data,
      width:"800px",
      header: "Create/Update PE Columns",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete PeDefinition
   * @param peDefinition
   */
  delete(peDefinition: PeDefinition): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this PeDefinition?",
      accept: () => {
        this.peDefinitionService.delete(peDefinition.id!).subscribe((resp) => {
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
    resp: CustomResponse<PeDefinition[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/pe-definition"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.peDefinitionsNodeTree = (resp?.data ?? []).map((c) => {
      return {
        data: c,
        children: [],
        leaf: false,
      };
    });
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Pe Definition");
  }
  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<NationalReference>>
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

  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
  }

  onNodeExpand(event: any): void {
    const node = event.node;
    this.isLoading = true;
    // Load children by parent_id= node.data.id
    this.peDefinitionService
      .query({
        parent_id: node.data.id,
        sort: ['id:asc'],
      })
      .subscribe(
        (resp) => {
          this.isLoading = false;
          // Map response data to @TreeNode type
          node.children = (resp?.data ?? []).map((c) => {
            return {
              data: c,
              children: [],
              leaf: false,
            };
          });
          // Update Tree state
          this.peDefinitionsNodeTree = [...this.peDefinitionsNodeTree!];
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

}
