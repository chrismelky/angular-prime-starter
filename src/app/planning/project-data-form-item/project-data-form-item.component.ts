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
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";
import { ProjectDataFormQuestion } from "src/app/setup/project-data-form-question/project-data-form-question.model";
import { ProjectDataFormQuestionService } from "src/app/setup/project-data-form-question/project-data-form-question.service";
import { Section } from "src/app/setup/section/section.model";
import { SectionService } from "src/app/setup/section/section.service";
import { Project } from "src/app/setup/project/project.model";
import { ProjectService } from "src/app/setup/project/project.service";
import { ProjectDataForm } from "src/app/setup/project-data-form/project-data-form.model";
import { ProjectDataFormService } from "src/app/setup/project-data-form/project-data-form.service";

import { ProjectDataFormItem } from "./project-data-form-item.model";
import { ProjectDataFormItemService } from "./project-data-form-item.service";
import { ProjectDataFormItemUpdateComponent } from "./update/project-data-form-item-update.component";

@Component({
  selector: "app-project-data-form-item",
  templateUrl: "./project-data-form-item.component.html",
})
export class ProjectDataFormItemComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  projectDataFormItems?: ProjectDataFormItem[] = [];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  projectDataFormQuestions?: ProjectDataFormQuestion[] = [];
  sections?: Section[] = [];
  projects?: Project[] = [];
  projectDataForms?: ProjectDataForm[] = [];
  projectDataFormParent?: ProjectDataForm[] = [];
  projectDataMetaDataArray: any = {};
  dataValues: any = [];
  parentMetadata: any = [];
  selectedCategory: any = null;

  /** Start here */
  dataValuesArray: any = {};

  cols = [
    {
      field: "project_data_form_question_id",
      header: "Project Data Form Question ",
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
  admin_hierarchy_id!: number;
  financial_year_id!: number;
  section_id!: number;
  project_id!: number;
  project_data_form_id!: number;
  project_data_form_parent_id!: number;

  constructor(
    protected projectDataFormItemService: ProjectDataFormItemService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected projectDataFormQuestionService: ProjectDataFormQuestionService,
    protected sectionService: SectionService,
    protected projectService: ProjectService,
    protected projectDataFormService: ProjectDataFormService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.sectionService
      .query({ columns: ["id", "name","code"],position:3 })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );


    this.projectDataFormService
      .query({ columns: ["id", "name"],parent_id:'' })
      .subscribe(
        (resp: CustomResponse<ProjectDataForm[]>) =>
          (this.projectDataFormParent = resp.data)
      );
    this.handleNavigation();
  }


  onDataFormParentChanged(){
    this.projectDataFormService
      .query({ columns: ["id", "name"],parent_id:this.project_data_form_parent_id })
      .subscribe(
        (resp: CustomResponse<ProjectDataForm[]>) =>
          (this.projectDataForms = resp.data)
      );
  }


  onAdminHierarchySelection(admin: AdminHierarchy): void {
    this.admin_hierarchy_id = admin?.id!;
    this.filterChanged();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.section_id ||
      !this.project_id ||
      !this.project_data_form_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.projectDataFormItemService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        section_id: this.section_id,
        project_id: this.project_id,
        project_data_form_id: this.project_data_form_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<ProjectDataFormItem[]>) => {
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


    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.section_id
    ) {
      return;
    }
    /** clear project */
    this.project_id = undefined!;
    this.projectService
      .queryProjectByDepartment({ columns: ["id", "name"],
        financial_year_id:this.financial_year_id,
        admin_hierarchy_id:this.admin_hierarchy_id,
        section_id:this.section_id
      })
      .subscribe(
          (resp: CustomResponse<Project[]>) => (this.projects = resp.data)
      );
  }

  mandatoryFilterChanged(){
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.project_data_form_id ||
      !this.project_id ||
      !this.section_id
    ) {
      return;
    }

    this.dataValues = [];
    this.parentMetadata = [];
    this.projectDataFormQuestionService
      .questionWithOptions(this.project_data_form_id)
      .subscribe(
        (resp: CustomResponse<ProjectDataFormQuestion[]>) => {
          this.projectDataFormQuestions = resp.data
          this.prepareDataValuesArray();
          //  this.updateFetchedMetaData(resp.data);
        }
      );
  }

  prepareDataValuesArray(): void {
    this.projectDataFormQuestions?.forEach((pd) => {
      this.dataValuesArray[pd.id!] = {};
      pd?.options.forEach((opt:any) => {

        const existing = this.dataValues?.find((dv:any) => {
          return (
            dv.project_data_form_question_id === pd.id &&
            dv.project_data_form_option_id === opt.id
          );
        });

        this.dataValuesArray[pd.id!][opt.id!] = {
          id: existing ? existing.id : undefined,
          value: existing ? existing.value : undefined,
          project_data_form_question_id: existing ? existing.project_data_form_question_id : undefined,
          project_data_form_option_id: existing ? existing.project_data_form_option_id : undefined,
        };
      })
    });
  }

  saveValue(event: any, dataValue: any): void {
    console.log("saveValue")
    console.log(event)
    console.log(this.dataValuesArray)
  }

  updateFetchedMetaData(fetchedDataMetaData: any) {
    fetchedDataMetaData?.forEach((r:any) => {
      this.parentMetadata.push(r);
      r.options?.forEach((f:any) => {
        let object: any = {
          ...f,
          uid: f.id,
          parent:r.id,
          value:''
        };
       this.dataValues.push(object);
      });
    });
  }

  updateValue(data: any) {
    console.log("INFORMATIONS")
    console.log(data)
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
   * Creating or updating ProjectDataFormItem
   * @param projectDataFormItem ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(projectDataFormItem?: ProjectDataFormItem): void {
    const data: ProjectDataFormItem = projectDataFormItem ?? {
      ...new ProjectDataFormItem(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      section_id: this.section_id,
      project_id: this.project_id,
      project_data_form_id: this.project_data_form_id,
    };
    const ref = this.dialogService.open(ProjectDataFormItemUpdateComponent, {
      data,
      header: "Create/Update ProjectDataFormItem",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete ProjectDataFormItem
   * @param projectDataFormItem
   */
  delete(projectDataFormItem: ProjectDataFormItem): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this ProjectDataFormItem?",
      accept: () => {
        this.projectDataFormItemService
          .delete(projectDataFormItem.id!)
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
    resp: CustomResponse<ProjectDataFormItem[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/project-data-form-item"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.projectDataFormItems = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Project Data Form Item");
  }
}
