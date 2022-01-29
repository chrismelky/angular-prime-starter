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
import {ConfirmationService, LazyLoadEvent, MenuItem, TreeNode} from "primeng/api";
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

import { ProjectDataForm } from "./project-data-form.model";
import { ProjectDataFormService } from "./project-data-form.service";
import { ProjectDataFormUpdateComponent } from "./update/project-data-form-update.component";

@Component({
  selector: "app-project-data-form",
  templateUrl: "./project-data-form.component.html",
})
export class ProjectDataFormComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  projectDataForms?: ProjectDataForm[] = [];
  projectDataFormsNodeTree?: TreeNode[] = [];


  parents?: ProjectDataForm[] = [];

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
      field: "is_lowest",
      header: "Is Lowest",
      sort: false,
    },
    {
      field: "is_active",
      header: "Is Active",
      sort: false,
    },
    {
      field: "sort_order",
      header: "Sort Order",
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
    protected projectDataFormService: ProjectDataFormService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.projectDataFormService
      .query({ columns: ["id", "name"],parent_id: null })
      .subscribe(
        (resp: CustomResponse<ProjectDataForm[]>) => (this.parents = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.projectDataFormService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        parent_id: null,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<ProjectDataForm[]>) => {
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
   * Creating or updating ProjectDataForm
   * @param projectDataForm ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(projectDataForm?: ProjectDataForm): void {
    const data: ProjectDataForm = projectDataForm ?? {
      ...new ProjectDataForm(),
    };
    const ref = this.dialogService.open(ProjectDataFormUpdateComponent, {
      data,
      header: "Create/Update ProjectDataForm",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete ProjectDataForm
   * @param projectDataForm
   */
  delete(projectDataForm: ProjectDataForm): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this ProjectDataForm?",
      accept: () => {
        this.projectDataFormService
          .delete(projectDataForm.id!)
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
    resp: CustomResponse<ProjectDataForm[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/project-data-form"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    //this.projectDataForms = resp?.data ?? [];
    this.projectDataFormsNodeTree = (resp?.data ?? []).map((c) => {
      return {
        data: c,
        children: [],
        leaf: false,
      };
    });
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Project Data Form");
  }

  onNodeExpand(event: any): void {
    const node = event.node;
    this.isLoading = true;
    this.projectDataFormService
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
          this.projectDataFormsNodeTree = [...this.projectDataFormsNodeTree!];
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

}
