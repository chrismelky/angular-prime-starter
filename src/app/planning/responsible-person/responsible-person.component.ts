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

import { ResponsiblePerson } from './responsible-person.model';
import { ResponsiblePersonService } from './responsible-person.service';
import { ResponsiblePersonUpdateComponent } from './update/responsible-person-update.component';
import { UserService } from 'src/app/setup/user/user.service';
import { Sector } from 'src/app/setup/sector/sector.model';
import { User } from 'src/app/setup/user/user.model';
import { SectorService } from 'src/app/setup/sector/sector.service';

@Component({
  selector: 'app-responsible-person',
  templateUrl: './responsible-person.component.html',
})
export class ResponsiblePersonComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  responsiblePeople?: ResponsiblePerson[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  sectors?: Sector[] = [];

  cols = [
    {
      field: 'name',
      header: 'Name',
      sort: true,
    },
    {
      field: 'mobile',
      header: 'Mobile',
      sort: true,
    },
    {
      field: 'email',
      header: 'Email',
      sort: false,
    },
    {
      field: 'cheque_number',
      header: 'Cheque Number',
      sort: true,
    },
    {
      field: 'title',
      header: 'Title',
      sort: true,
    },
    {
      field: 'facility_id',
      header: 'Facility ',
      sort: false,
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
  currentUser?: User;

  //Mandatory filter
  admin_hierarchy_id!: number;
  sector_id!: number;

  constructor(
    protected responsiblePersonService: ResponsiblePersonService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected userService: UserService,
    protected sectorService: SectorService
  ) {
    this.currentUser = userService.getCurrentUser();
    if (this.currentUser.admin_hierarchy) {
      this.admin_hierarchy_id = this.currentUser.admin_hierarchy?.id!;
      this.adminHierarchies?.push(this.currentUser.admin_hierarchy);
    }
    if (this.currentUser?.section) {
      this.sector_id = this.currentUser.section?.sector_id!;
    }
  }

  ngOnInit(): void {
    this.sectorService.query().subscribe((resp) => (this.sectors = resp.data));
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfuly update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.admin_hierarchy_id || !this.sector_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.responsiblePersonService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        sector_id: this.sector_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<ResponsiblePerson[]>) => {
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

  onAdminHierarchySelection(adminHierarcyId: number): void {
    this.admin_hierarchy_id = adminHierarcyId;
    this.filterChanged();
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
   * Creating or updating ResponsiblePerson
   * @param responsiblePerson ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(responsiblePerson?: ResponsiblePerson): void {
    const data: ResponsiblePerson = responsiblePerson ?? {
      ...new ResponsiblePerson(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      sector_id: this.sector_id,
      is_active: true,
    };
    const ref = this.dialogService.open(ResponsiblePersonUpdateComponent, {
      data,
      header: 'Create/Update ResponsiblePerson',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete ResponsiblePerson
   * @param responsiblePerson
   */
  delete(responsiblePerson: ResponsiblePerson): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this ResponsiblePerson?',
      accept: () => {
        this.responsiblePersonService
          .delete(responsiblePerson.id!)
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
    resp: CustomResponse<ResponsiblePerson[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/responsible-person'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.responsiblePeople = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Responsible Person');
  }
}
