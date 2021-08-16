import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../utils/custom-response';
import { FacilityType } from './facility-type.model';

import { ITEMS_PER_PAGE } from '../../config/pagination.constants';
import { FacilityTypeService } from './facility-type.service';
import { FacilityTypeUpdateComponent } from './update/facility-type-update.component';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from 'src/app/utils/helper.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-facility-type',
  templateUrl: './facility-type.component.html',
  providers: [ConfirmationService, DialogService],
})
export class FacilityTypeComponent implements OnInit {
  facilityTypes?: FacilityType[] = [];
  cols = [
    { field: 'name', header: 'Name' },
    { field: 'code', header: 'Code' },
  ];
  menus: MenuItem[] = [];
  isLoading = false;
  totalItems = 0;
  perPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  filter: any = {};

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

  search(): void {
    this.page = 1;
    this.loadPage();
  }

  clearSearch(): void {
    this.filter = {};
    this.page = 1;
    this.loadPage();
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

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

  pageChanged(event: LazyLoadEvent): void {
    this.page = event.first! / event.rows! + 1;
    this.perPage = event.rows!;
    this.loadPage();
  }

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

  protected sort(): string[] {
    const result = [this.predicate + ':' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([
      this.activatedRoute.data,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
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
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.facilityTypes = resp?.data ?? [];
  }

  protected onError(): void {
    this.toastService.error('Error loading facility type');
  }
}
