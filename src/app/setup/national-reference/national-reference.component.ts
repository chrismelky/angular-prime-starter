/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import {
  ConfirmationService,
  LazyLoadEvent,
  MenuItem,
  TreeNode,
} from 'primeng/api';
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
import { EnumService, PlanrepEnum } from 'src/app/shared/enum.service';
import { ReferenceType } from 'src/app/setup/reference-type/reference-type.model';
import { ReferenceTypeService } from 'src/app/setup/reference-type/reference-type.service';

import { NationalReference } from './national-reference.model';
import { NationalReferenceService } from './national-reference.service';
import { NationalReferenceUpdateComponent } from './update/national-reference-update.component';
import { finalize } from 'rxjs/operators';
import { TreeTable } from 'primeng/treetable';

@Component({
  selector: 'app-national-reference',
  templateUrl: './national-reference.component.html',
})
export class NationalReferenceComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: TreeTable;
  nationalReferences?: TreeNode[] = [];
  referenceTypes?: ReferenceType[] = [];
  parents?: NationalReference[] = [];
  linkLevels?: PlanrepEnum[] = [];

  cols = [
    {
      field: 'description',
      header: 'Description',
      sort: true,
    },
    {
      field: 'code',
      header: 'Code',
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
  reference_type_id!: number;
  link_level!: string;

  constructor(
    protected nationalReferenceService: NationalReferenceService,
    protected referenceTypeService: ReferenceTypeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.referenceTypeService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<ReferenceType[]>) =>
          (this.referenceTypes = resp.data)
      );
    this.nationalReferenceService
      .query({ columns: ['id', 'description'] })
      .subscribe(
        (resp: CustomResponse<NationalReference[]>) =>
          (this.parents = resp.data)
      );
    this.linkLevels = this.enumService.get('linkLevels');
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
    this.nationalReferenceService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        reference_type_id: this.reference_type_id,
        parent_id: null,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<NationalReference[]>) => {
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
   * Creating or updating NationalReference
   * @param nationalReference ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(nationalReference?: NationalReference): void {
    const data: NationalReference = nationalReference ?? {
      ...new NationalReference(),
      reference_type_id: this.reference_type_id,
      link_level: this.link_level,
    };
    const ref = this.dialogService.open(NationalReferenceUpdateComponent, {
      data,
      header: 'Create/Update NationalReference',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete NationalReference
   * @param nationalReference
   */
  delete(nationalReference: NationalReference): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this NationalReference?',
      accept: () => {
        this.nationalReferenceService
          .delete(nationalReference.id!)
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
    resp: CustomResponse<NationalReference[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/national-reference'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.nationalReferences = (resp?.data ?? []).map((c) => {
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
    this.toastService.error('Error loading National Reference');
  }

  /**
   * toggleActivation event
   * @param row Data = constist of row Data
   */
  toggleActivation(row: any) {
    var nationalReference = this.createFromForm(row);
    this.subscribeToSaveResponse(
      this.nationalReferenceService.update(nationalReference)
    );
    this.handleNavigation();
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

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {}

  /**
   * Return form values as object of type NationalReference
   * @returns NationalReference
   */
  protected createFromForm(row: any): NationalReference {
    return {
      ...new NationalReference(),
      id: row.id,
      code: row.code,
      description: row.description,
      active: row.active,
      reference_type_id: row.reference_type_id,
      parent_id: row.parent_id,
      link_level: row.link_level,
    };
  }

  /**
   * When cas content expanded load children
   * @param event = constist of node data
   */
  onNodeExpand(event: any): void {
    const node = event.node;
    this.isLoading = true;
    // Load children by parent_id= node.data.id
    this.nationalReferenceService
      .query({
        parent_id: node.data.id,
        sort: ['code:asc'],
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
          this.nationalReferences = [...this.nationalReferences!];
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }
}
