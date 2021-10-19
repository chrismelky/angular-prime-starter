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
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { ReferenceDocumentType } from 'src/app/setup/reference-document-type/reference-document-type.model';
import { ReferenceDocumentTypeService } from 'src/app/setup/reference-document-type/reference-document-type.service';

import { ReferenceDocument } from './reference-document.model';
import { ReferenceDocumentService } from './reference-document.service';
import { ReferenceDocumentUpdateComponent } from './update/reference-document-update.component';
import { FinancialYear } from '../financial-year/financial-year.model';
import { FinancialYearService } from '../financial-year/financial-year.service';
import {error} from "@angular/compiler/src/util";

@Component({
  selector: 'app-reference-document',
  templateUrl: './reference-document.component.html',
})
export class ReferenceDocumentComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  referenceDocuments?: ReferenceDocument[] = [];

  startFinancialYears?: FinancialYear[] = [];
  endFinancialYears?: FinancialYear[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  referenceDocumentTypes?: ReferenceDocumentType[] = [];

  cols = [
    {
      field: 'name',
      header: 'Name',
      sort: false,
    },
    {
      field: 'description',
      header: 'Description',
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
  admin_hierarchy_id!: number;
  reference_document_type_id!: number;
  admin_hierarchy_position!: number;

  constructor(
    protected referenceDocumentService: ReferenceDocumentService,
    protected financialYearService: FinancialYearService,
    protected adminHierarchyService: AdminHierarchyService,
    protected referenceDocumentTypeService: ReferenceDocumentTypeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.startFinancialYears = resp.data)
      );
    this.referenceDocumentTypeService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<ReferenceDocumentType[]>) =>
          (this.referenceDocumentTypes = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.admin_hierarchy_id || !this.reference_document_type_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.referenceDocumentService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        reference_document_type_id: this.reference_document_type_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<ReferenceDocument[]>) => {
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
   *
   * @param event adminhierarchyId or Ids
   */
  onAdminHierarchySelection(event: any): void {
    this.admin_hierarchy_id = event.id;
    this.admin_hierarchy_position =event.admin_hierarchy_position;
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
   * Creating or updating ReferenceDocument
   * @param referenceDocument ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(referenceDocument?: ReferenceDocument): void {
    const data: ReferenceDocument = referenceDocument ?? {
      ...new ReferenceDocument(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      reference_document_type_id: this.reference_document_type_id,
    };
    const ref = this.dialogService.open(ReferenceDocumentUpdateComponent, {
      data,
      header: 'Create/Update ReferenceDocument',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete ReferenceDocument
   * @param referenceDocument
   */
  delete(referenceDocument: ReferenceDocument): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this ReferenceDocument?',
      accept: () => {
        this.referenceDocumentService
          .delete(referenceDocument.id!)
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
    resp: CustomResponse<ReferenceDocument[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/reference-document'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.referenceDocuments = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Reference Document');
  }

  download(id: number) {
    this.referenceDocumentService.fileDownload(id).subscribe( resp =>{
      let file = new Blob([resp], { type: 'application/pdf'});
      let fileURL = URL.createObjectURL(file);
      window.open(fileURL,"_blank");
    });

  }
}
