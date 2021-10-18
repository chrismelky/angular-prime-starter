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
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';

import { ScrutinizationService } from './scrutinization.service';
import { ScrutinizationUpdateComponent } from './update/scrutinization-update.component';
import { ActivityService } from '../activity/activity.service';
import { Activity } from '../activity/activity.model';
import {Scrutinization} from "./scrutinization.model";
import {SetCommentComponent} from "../assessment-criteria/update/set-comment.component";
import {InputUpdateComponent} from "./update/input-update.component";
import {User} from "../../setup/user/user.model";
import {UserService} from "../../setup/user/user.service";

@Component({
  selector: 'app-scrutinization',
  templateUrl: './scrutinization.component.html',
})
export class ScrutinizationComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  scrutinizations?: Scrutinization[] = [];

  adminHierarchies?: AdminHierarchy[] = [];
  sections?: Section[] = [];
  departments?: Section[] = [];
  activities: Activity[] | undefined = [];

  columns = []; //Table display columns

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
  section_id!: number;
  parent_id!: number;
  admin_hierarchy_position!: number;
  budget_type = 'CURRENT';
  currentUser: User;

  constructor(
    protected scrutinizationService: ScrutinizationService,
    protected adminHierarchyService: AdminHierarchyService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected userService: UserService,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {
    this.currentUser = userService.getCurrentUser();
  }

  ngOnInit(): void {
    this.sectionService
      .query({ position: 3 })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.departments = resp.data)
      );
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (!this.admin_hierarchy_id || !this.parent_id || !this.section_id) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.scrutinizationService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        section_id: this.section_id,
        parent_id: this.parent_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<Scrutinization[]>) => {
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
  onAdminHierarchySelection(event: any): void {
    this.admin_hierarchy_id = event.id;
    this.admin_hierarchy_position = event.admin_hierarchy_position;
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
   * Creating or updating Scrutinization
   * @param scrutinization ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(scrutinization?: Scrutinization): void {
    const data: Scrutinization = scrutinization ?? {
      ...new Scrutinization(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      section_id: this.section_id,
    };
    const ref = this.dialogService.open(ScrutinizationUpdateComponent, {
      data,
      header: 'Create/Update Scrutinization',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete Scrutinization
   * @param scrutinization
   */
  delete(scrutinization: Scrutinization): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Scrutinization?',
      accept: () => {
        this.scrutinizationService
          .delete(scrutinization.id!)
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
    resp: CustomResponse<Scrutinization[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/scrutinization'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.scrutinizations = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Scrutinization');
  }

  filterSections() {
    this.sectionService
      .query({ parent_id: this.parent_id })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
  }
  loadActivities() {
    this.scrutinizationService
      .queryActivities({
        page: this.page,
        perPage: this.per_page,
        section_id: this.section_id,
        admin_hierarchy_id: this.admin_hierarchy_id,
        budget_type: this.budget_type,
        financial_year_id: this.currentUser.admin_hierarchy?.current_financial_year_id
      })
      .subscribe(
        (resp: CustomResponse<Activity[]>) => (
          this.scrutinizations = resp.data
        )
      );
  }

  loadInputs(activityId: number){
      console.log(activityId)
  }

  setActivityComments(activity: any) {
    let data = activity;
    const ref = this.dialogService.open(ScrutinizationUpdateComponent, {
      data,
      header: "Activity Comments",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadActivities();
      }
    });
  }

  setInputComments(input: any) {
    let data = input;
    const ref = this.dialogService.open(InputUpdateComponent, {
      data,
      header: "Input Comments",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        // this.loadPage(this.page);
      }
    });
  }
}
