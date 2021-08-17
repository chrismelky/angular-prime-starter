import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../utils/custom-response';
import { FacilityType } from './facility-type.model';

import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from '../../config/pagination.constants';
import { FacilityTypeService } from './facility-type.service';
import { FacilityTypeUpdateComponent } from './update/facility-type-update.component';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from 'src/app/utils/helper.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-facility-type',
  templateUrl: './facility-type.component.html',
})
export class FacilityTypeComponent implements OnInit {
  facilityTypes?: FacilityType[] = [];
  cols = [
    { field: 'name', header: 'Name' },
    { field: 'code', header: 'Code' },
  ]; //Table display columns
  isLoading = false;
  totalItems = 0;
  perPage = ITEMS_PER_PAGE;
  perPageOptions = PER_PAGE_OPTIONS;
  page?: number = 1;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  filter: any = {}; // items filter objects

  cities = [
    { name: 'New York', code: 'NY', inactive: false },
    { name: 'Rome', code: 'RM', inactive: true },
    { name: 'London', code: 'LDN', inactive: false },
    { name: 'Istanbul', code: 'IST', inactive: true },
    { name: 'Paris', code: 'PRS', inactive: false },
  ];

  constructor(
    protected facilityTypeService: FacilityTypeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected dialog: MatDialog,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.handleNavigation();
  }

  /**
   * Load data
   * @param page
   * @param dontNavigate
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.facilityTypeService
      .query({
        page: pageToLoad,
        per_page: this.perPage,
        sort: this.sort(),
        ...this.helper.buildFilter(this.filter),
      })
      .subscribe(
        (res: CustomResponse<FacilityType[]>) => {
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
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(':');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (
        pageNumber !== this.page ||
        predicate !== this.predicate ||
        ascending !== this.ascending
      ) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  /**
   * When page changed
   * @param event page event to
   */
  pageChanged(event: LazyLoadEvent): void {
    this.page = event.first! / event.rows! + 1;
    this.perPage = event.rows!;
    this.loadPage();
  }

  /**
   * search items by @var filter params
   */
  search(): void {
    this.page = 1;
    this.loadPage();
  }

  /**
   * Clear search params
   */
  clearSearch(): void {
    this.filter = {};
    this.page = 1;
    this.loadPage();
  }

  /**
   * Impletement sorting Set/Reurn the sorting option for data
   * @returns dfefault ot id sorting
   */
  protected sort(): string[] {
    return ['id:asc'];
  }

  /**
   * Creating or updating FacilityType
   * @param facilityType ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(facilityType?: FacilityType): void {
    const data: FacilityType = facilityType ?? { ...new FacilityType() };
    const ref = this.dialogService.open(FacilityTypeUpdateComponent, {
      data,
      header: 'Create/Update Facility Type',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete FacilityType
   * @param facilityType
   */
  delete(facilityType: FacilityType): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this action FacilityType?',
      accept: () => {
        this.facilityTypeService.delete(facilityType.id!).subscribe((resp) => {
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
    resp: CustomResponse<FacilityType[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/facility-type'], {
        queryParams: {
          page: this.page,
          per_page: this.perPage,
          sort: this.predicate + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.facilityTypes = resp?.data ?? [];
  }

  /**
   * When error on loading data
   */
  protected onError(): void {
    this.toastService.error('Error loading facility type');
  }
}
