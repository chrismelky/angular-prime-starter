import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../utils/custom-response';
import { Facility } from './facility.model';

import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from '../../config/pagination.constants';
import { FacilityType } from 'src/app/setup/facility-type/facility-type.model';
import { FacilityTypeService } from 'src/app/setup/facility-type/facility-type.service';
import { FacilityService } from './facility.service';
import { FacilityUpdateComponent } from './update/facility-update.component';
import { HelperService } from 'src/app/utils/helper.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
})
export class FacilityComponent implements OnInit {
  facilities?: Facility[] = [];
  facilityTypes?: FacilityType[] = [];
  cols = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'facility_type_id', header: 'Facility Type ' },
  ]; //Table display columns
  isLoading = false;
  totalItems = 0;
  perPage = ITEMS_PER_PAGE;
  perPageOptions = PER_PAGE_OPTIONS;
  page?: number = 1;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  filter: any = {}; // items filter objects

  //Mandatory filter
  facility_type_id!: number;

  constructor(
    protected facilityService: FacilityService,
    protected facilityTypeService: FacilityTypeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.facilityTypeService
      .query()
      .subscribe(
        (resp: CustomResponse<FacilityType[]>) =>
          (this.facilityTypes = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data
   * @param page
   * @param dontNavigate
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    //  this.facilities = [];
    if (!this.facility_type_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.facilityService
      .query({
        page: pageToLoad,
        per_page: this.perPage,
        sort: this.sort(),
        facility_type_id: this.facility_type_id,
        ...this.helper.buildFilter(this.filter),
      })
      .subscribe(
        (res: CustomResponse<Facility[]>) => {
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
   * Creating or updating Facility
   * @param facility ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(facility?: Facility): void {
    const data: Facility = facility ?? {
      ...new Facility(),
      facility_type_id: this.facility_type_id,
    };
    const ref = this.dialogService.open(FacilityUpdateComponent, {
      data,
      header: 'Create/Update Facility',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete Facility
   * @param facility
   */
  delete(facility: Facility): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Facility?',
      accept: () => {
        this.facilityService.delete(facility.id!).subscribe((resp) => {
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
    resp: CustomResponse<Facility[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/facility'], {
        queryParams: {
          page: this.page,
          per_page: this.perPage,
          sort: this.predicate + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.facilities = resp?.data ?? [];
  }

  /**
   * When error on loading data
   */
  protected onError(): void {
    this.toastService.error('Error loading Facility');
  }
}
