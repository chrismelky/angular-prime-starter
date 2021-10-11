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
  MessageService,
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
import { FundSourceBudgetClass } from 'src/app/setup/fund-source-budget-class/fund-source-budget-class.model';
import { FundSourceBudgetClassService } from 'src/app/setup/fund-source-budget-class/fund-source-budget-class.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';

import { AdminHierarchyCeiling } from './admin-hierarchy-ceiling.model';
import { AdminHierarchyCeilingService } from './admin-hierarchy-ceiling.service';
import { AdminHierarchyCeilingUpdateComponent } from './update/admin-hierarchy-ceiling-update.component';
import { InitiateCeilingComponent } from './update/initiate-ceiling.component';
import { SectionLevelService } from '../../setup/section-level/section-level.service';
import { SectionLevel } from '../../setup/section-level/section-level.model';
import { finalize } from 'rxjs/operators';
import { User } from '../../setup/user/user.model';
import { UserService } from '../../setup/user/user.service';
import { CeilingDisseminationComponent } from './update/ceiling-dissemination.component';
import { CeilingChainService } from '../../setup/ceiling-chain/ceiling-chain.service';
import { CeilingChain } from '../../setup/ceiling-chain/ceiling-chain.model';
import { FinalizeCeilingComponent } from './update/finalize-ceiling.component';
import { saveAs } from 'file-saver';
import { UploadCeilingComponent } from './update/upload-ceiling.component';
import { LockCeilingComponent } from './update/lock-ceiling.component';
import {AdminCeilingDisseminationComponent} from "./update/admin-ceiling-dissemination.component";

@Component({
  selector: 'app-admin-hierarchy-ceiling',
  templateUrl: './admin-hierarchy-ceiling.component.html',
})
export class AdminHierarchyCeilingComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  adminHierarchyCeilings?: AdminHierarchyCeiling[] = [];

  ceilings?: FundSourceBudgetClass[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  parents?: AdminHierarchyCeiling[] = [];
  sections?: Section[] = [];
  planingLevels?: SectionLevel[] = [];
  budgetTypes?: PlanrepEnum[] = [];
  isSaving?: boolean = false;
  clonedCeiling: { [s: string]: AdminHierarchyCeiling } = {};

  isLoading = false;
  page?: number = 1;
  per_page!: number;
  ceilingStartPosition!: any;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects
  items: MenuItem[] | undefined;
  rootSection?: Section;
  currentUser!: User;

  //Mandatory filter
  admin_hierarchy_id!: number;
  financial_year_id!: number;
  budget_type = 'CURRENT';
  position!: number | undefined;
  section_id!: number | undefined;
  admin_hierarchy_position!: number;

  constructor(
    protected adminHierarchyCeilingService: AdminHierarchyCeilingService,
    protected ceilingService: FundSourceBudgetClassService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected parentService: AdminHierarchyService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected enumService: EnumService,
    protected sectionLevelService: SectionLevelService,
    protected ceilingChainService: CeilingChainService,
    protected userService: UserService
  ) {
    this.currentUser = userService.getCurrentUser();
    this.financial_year_id = this.currentUser?.admin_hierarchy?.current_financial_year_id!;
  }

  ngOnInit(): void {
    this.rootSection = this.currentUser.section;
    this.section_id = this.rootSection?.id;
    this.position = this.rootSection?.position;
    this.ceilingService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FundSourceBudgetClass[]>) =>
          (this.ceilings = resp.data)
      );
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.adminHierarchyCeilingService
      .ceilingStartPosition()
      .subscribe(
        (resp: CustomResponse<any>) => {
          this.ceilingStartPosition = +resp.data;
        }
      );
    this.sectionLevelService
      .query({ columns: ['id', 'name', 'position'] })
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) =>
          (this.planingLevels = resp.data)
      );
    this.parentService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchyCeiling[]>) =>
          (this.parents = resp.data)
      );
    this.budgetTypes = this.enumService.get('budgetTypes');
    this.handleNavigation();
    this.items = [
      {
        label: 'Download Template',
        icon: 'pi pi-download',
        command: () => {
          this.downloadTemplate();
        },
      },
      {
        label: 'Upload Ceiling',
        icon: 'pi pi-upload',
        command: () => {
          this.uploadCeiling();
        },
      },
      {
        label: 'Lock/Unlock Ceiling',
        icon: 'pi pi-lock',
        command: () => {
          this.lockUnlockCeiling();
        },
      },
    ];
  }

  uploadCeiling() {
    const ref = this.dialogService.open(UploadCeilingComponent, {
      header: 'Upload Ceiling Template File',
      data: {
        admin_hierarchy_id: this.admin_hierarchy_id,
        budget_type: this.budget_type,
        section_id: this.section_id,
        financial_year_id: this.financial_year_id,
      },
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }
  downloadTemplate() {
    this.adminHierarchyCeilingService
      .queryDownloadTemplate({
        admin_hierarchy_id: this.admin_hierarchy_id,
        section_id: this.section_id,
      })
      .subscribe((response: BlobPart) => {
        saveAs(
          new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          'ceiling-upload-template.xlsx'
        );
      });
  }
  lockUnlockCeiling() {
    const ref = this.dialogService.open(LockCeilingComponent, {
      data: {
        admin_hierarchy_id: this.admin_hierarchy_id,
        admin_hierarchy_position: this.admin_hierarchy_position,
        position: this.position,
        financial_year_id: this.financial_year_id,
        budget_type: this.budget_type,
      },
      width: '60%',
      header: 'Lock/Unlock Ceiling',
    });
    ref.onClose.subscribe((result) => {
      this.loadPage(this.page);
    });
  }

  selectionLevelChange() {
    this.sectionService
      .query({ position: this.position })
      .subscribe((resp: CustomResponse<Section[]>) => {
        this.sections = resp.data;
        // @ts-ignore
        if (this.rootSection.position === this.position) {
          this.section_id = this.rootSection?.id;
        } else {
          // @ts-ignore
          this.section_id = this.sections[0].id;
        }
        this.loadPage();
      });
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
      !this.budget_type
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;

    this.adminHierarchyCeilingService
      .queryCeilingWithChildren({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        budget_type: this.budget_type,
        section_id: this.section_id,
        position: this.position,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<AdminHierarchyCeiling[]>) => {
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
   * Creating or updating AdminHierarchyCeiling
   * @param adminHierarchyCeiling ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(adminHierarchyCeiling?: AdminHierarchyCeiling): void {
    const data: AdminHierarchyCeiling = adminHierarchyCeiling ?? {
      ...new AdminHierarchyCeiling(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      budget_type: this.budget_type,
    };
    const ref = this.dialogService.open(AdminHierarchyCeilingUpdateComponent, {
      data,
      header: 'Create/Update AdminHierarchyCeiling',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete AdminHierarchyCeiling
   * @param adminHierarchyCeiling
   */
  delete(adminHierarchyCeiling: AdminHierarchyCeiling): void {
    this.confirmationService.confirm({
      message:
        'Are you sure that you want to delete this AdminHierarchyCeiling?',
      accept: () => {
        this.adminHierarchyCeilingService
          .delete(adminHierarchyCeiling.id!)
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
    resp: CustomResponse<AdminHierarchyCeiling[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/admin-hierarchy-ceiling'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.adminHierarchyCeilings = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Admin Hierarchy Ceiling');
  }

  /**
   *
   * @param event adminhierarchyId or Ids
   */
  onAdminHierarchySelection(event: any): void {
    this.admin_hierarchy_id = event.id;
    this.admin_hierarchy_position = event.admin_hierarchy_position;
    this.loadPage();
  }

  /**
   * Creating or updating AdminHierarchyCeiling
   * @param adminHierarchyCeiling ; If undefined initize new model to create else edit existing model
   */
  initiateCeiling(): void {
    const ref = this.dialogService.open(InitiateCeilingComponent, {
      header: 'Ceiling Dissemination',
      width: '60%',
      data: this.adminHierarchyCeilings,
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        for (let item of result.ceiling) {
          const adminHierarchyCeiling = this.createFromForm(item);
          this.subscribeToSaveResponse(
            this.adminHierarchyCeilingService.initiateCeiling(adminHierarchyCeiling)
          );
        }
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Return form values as object of type AdminHierarchyCeiling
   * @returns AdminHierarchyCeiling
   */
  protected createFromForm(ceiling: any): AdminHierarchyCeiling {
    return {
      ...new AdminHierarchyCeiling(),
      ceiling_id: ceiling.id,
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      parent_id: undefined,
      section_id: this.section_id,
      active: true,
      is_locked: false,
      is_approved: false,
      budget_type: this.budget_type,
      amount: 0.0,
    };
  }

  /**
   * Return form values as object of type AdminHierarchyCeiling
   * @returns AdminHierarchyCeiling
   */
  public updateFromForm(ceiling: any): AdminHierarchyCeiling {
    return {
      ...new AdminHierarchyCeiling(),
      id: ceiling.id,
      ceiling_id: ceiling.ceiling_id,
      admin_hierarchy_id: ceiling.admin_hierarchy_id,
      financial_year_id: ceiling.financial_year_id,
      parent_id: ceiling.parent_id,
      section_id: ceiling.section_id,
      active: ceiling.active,
      is_locked: ceiling.is_locked,
      is_approved: ceiling.approved,
      budget_type: ceiling.budget_type,
      amount: ceiling.amount,
      is_facility: false,
    };
  }
  public subscribeToSaveResponse(
    result: Observable<CustomResponse<AdminHierarchyCeiling>>
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

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  onRowEditInit(ceiling: AdminHierarchyCeiling) {
    // @ts-ignore
    this.clonedCeiling[ceiling.id] = {
      ...ceiling,
    };
  }

  onRowEditSave(ceiling: AdminHierarchyCeiling) {
    const adminHierarchyCeiling = this.updateFromForm(ceiling);
    this.subscribeToSaveResponse(
      this.adminHierarchyCeilingService.update(adminHierarchyCeiling)
    );
  }

  onRowEditCancel(ceiling: AdminHierarchyCeiling, index: number) {
    // @ts-ignore
    this.adminHierarchyCeilings[index] = this.clonedCeiling[ceiling.id];
    // @ts-ignore
    delete this.clonedCeiling[ceiling.id];
  }

  toggleActivation(row: AdminHierarchyCeiling) {
    this.confirmationService.confirm({
      message:
        'Are you sure that you want to ' +
        (row.is_locked ? 'Lock Ceiling?' : 'Unlock Ceiling?'),
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const adminHierarchyCeiling = this.updateFromForm(row);
        this.subscribeToSaveResponse(
          this.adminHierarchyCeilingService.update(adminHierarchyCeiling)
        );
      },
      reject: () => {
        this.loadPage();
      },
    });
  }

  allocateCeiling(row: AdminHierarchyCeiling){
    const data: any = {
      ceiling: row,
      position: this.admin_hierarchy_position,
      section_level_position: this.position,
      ceilingStartPosition:this.ceilingStartPosition,
      section_id: this.section_id,
    };
    const ref = this.dialogService.open(AdminCeilingDisseminationComponent, {
      header: 'Ceiling Dissemination',
      width: '80%',
      styleClass:'planrep-dialogy',
      data,
    });
    ref.onClose.subscribe((result) => {});
  }

  allocate(row: AdminHierarchyCeiling) {
    //get next ceiling Chain
    this.ceilingChainService
      .query({ section_level_position: this.position, active: true, page: 1 })
      .subscribe((resp: CustomResponse<CeilingChain[]>) => {
        let ceilingChain = resp.data ?? [];
        if (ceilingChain.length > 0) {
          const data: any = {
            ceiling: row,
            position: this.admin_hierarchy_position,
            ceilingChain: ceilingChain[0],
          };
          if (ceilingChain[0].next !== null) {
            const ref = this.dialogService.open(CeilingDisseminationComponent, {
              header: 'Ceiling Dissemination',
              width: '60%',
              data,
            });
            ref.onClose.subscribe((result) => {});
          } else {
            const ref = this.dialogService.open(FinalizeCeilingComponent, {
              header: 'Ceiling Dissemination',
              width: '60%',
              data,
            });
            ref.onClose.subscribe((result) => {});
          }
        } else {
          this.toastService.info(
            'Please Set The Ceiling Chain Before This Process'
          );
        }
      });
  }
}
