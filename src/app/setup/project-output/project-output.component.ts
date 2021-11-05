/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

import { CustomResponse } from '../../utils/custom-response';
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from '../../config/pagination.constants';
import { HelperService } from 'src/app/utils/helper.service';
import { ToastService } from 'src/app/shared/toast.service';

import { ProjectOutput } from './project-output.model';
import { ProjectOutputService } from './project-output.service';
import { ProjectOutputUpdateComponent } from './update/project-output-update.component';
import { ExpenditureCategory } from '../expenditure-category/expenditure-category.model';
import { Sector } from '../sector/sector.model';
import { ExpenditureCategoryService } from '../expenditure-category/expenditure-category.service';
import { SectorService } from '../sector/sector.service';
import { ProjectType } from '../project-type/project-type.model';
import { ProjectTypeService } from '../project-type/project-type.service';
import {UploadComponent} from "./upload/upload.component";

@Component({
  selector: 'app-project-output',
  templateUrl: './project-output.component.html',
})
export class ProjectOutputComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  projectOutputs?: ProjectOutput[] = [];

  categoryIsLoading = false;
  sectorIsLoading = false;
  projectTypeIsLoading = false;

  projectTypes?: ProjectType[] = [];
  expenditureCategories?: ExpenditureCategory[] = [];
  sectors?: Sector[] = [];

  cols = [
    {
      field: 'name',
      header: 'Name',
      sort: true,
    },
    {
      field: 'is_active',
      header: 'Is Active',
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
  expenditure_category_id!: number;
  sector_id!: number;

  constructor(
    protected projectOutputService: ProjectOutputService,
    protected expenditureCategoryService: ExpenditureCategoryService,
    protected sectorService: SectorService,
    protected projectTypeService: ProjectTypeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.sectorIsLoading = true;
    this.sectorService.query().subscribe(
      (resp) => {
        this.sectors = resp.data;
        this.sectorIsLoading = false;
      },
      (error) => (this.sectorIsLoading = false)
    );

    this.projectTypeIsLoading = true;
    this.projectTypeService.query().subscribe(
      (resp) => {
        this.projectTypes = resp.data;
        this.projectTypeIsLoading = false;
      },
      (error) => (this.projectTypeIsLoading = false)
    );

    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.expenditure_category_id || !this.sector_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.projectOutputService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        expenditure_category_id: this.expenditure_category_id,
        sector_id: this.sector_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<ProjectOutput[]>) => {
          this.isLoading = false;
          this.onSuccess(res, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  loadCategories(projectTypeId: number): void {
    this.categoryIsLoading = true;
    this.expenditureCategoryService
      .query({
        project_type_id: projectTypeId,
      })
      .subscribe(
        (resp) => {
          this.expenditureCategories = resp.data;
          this.categoryIsLoading = false;
        },
        (error) => (this.categoryIsLoading = false)
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
      const page = params.get('page');
      const perPage = params.get('per_page');
      const sort = (params.get('sort') ?? data['defaultSort']).split(':');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
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
    const predicate = this.predicate ? this.predicate : 'id';
    const direction = this.ascending ? 'asc' : 'desc';
    return [`${predicate}:${direction}`];
  }

  /**
   * Creating or updating ProjectOutput
   * @param projectOutput ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(projectOutput?: ProjectOutput): void {
    const data: ProjectOutput = projectOutput ?? {
      ...new ProjectOutput(),
      expenditure_category_id: this.expenditure_category_id,
      sector_id: this.sector_id,
    };
    const ref = this.dialogService.open(ProjectOutputUpdateComponent, {
      data: {
        projectOutPut: data,
        expenditureCategories: this.expenditureCategories,
        sectors: this.sectors,
      },
      header: 'Create/Update ProjectOutput',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete ProjectOutput
   * @param projectOutput
   */
  delete(projectOutput: ProjectOutput): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this ProjectOutput?',
      accept: () => {
        this.projectOutputService
          .delete(projectOutput.id!)
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
    resp: CustomResponse<ProjectOutput[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/project-output'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.projectOutputs = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Project Output');
  }

  upload(): void {
    const item =  {
      sectorId: this.sector_id,
      expenditureCategoryId: this.expenditure_category_id,
    };
    const ref = this.dialogService.open(UploadComponent, {
      width: '60%',
      header: 'Project Output Upload Form',
      data: item
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }
}
