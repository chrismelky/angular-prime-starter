/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest} from 'rxjs';
import {ConfirmationService, LazyLoadEvent, MenuItem} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {Paginator} from 'primeng/paginator';
import {Table} from 'primeng/table';

import {CustomResponse} from '../../utils/custom-response';
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from '../../config/pagination.constants';
import {HelperService} from 'src/app/utils/helper.service';
import {ToastService} from 'src/app/shared/toast.service';
import {AdminHierarchy} from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import {AdminHierarchyService} from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import {FinancialYear} from 'src/app/setup/financial-year/financial-year.model';
import {FinancialYearService} from 'src/app/setup/financial-year/financial-year.service';
import {PeSubForm} from 'src/app/setup/pe-sub-form/pe-sub-form.model';
import {PeSubFormService} from 'src/app/setup/pe-sub-form/pe-sub-form.service';
import {BudgetClass} from 'src/app/setup/budget-class/budget-class.model';
import {BudgetClassService} from 'src/app/setup/budget-class/budget-class.service';
import {FundSource} from 'src/app/setup/fund-source/fund-source.model';
import {FundSourceService} from 'src/app/setup/fund-source/fund-source.service';
import {Section} from 'src/app/setup/section/section.model';
import {SectionService} from 'src/app/setup/section/section.service';

import {PeItem} from './pe-item.model';
import {PeItemService} from './pe-item.service';
import {PeItemUpdateComponent} from './update/pe-item-update.component';
import {UserService} from '../../setup/user/user.service';
import {User} from '../../setup/user/user.model';
import {PeFormService} from '../../setup/pe-form/pe-form.service';
import {FundSourceBudgetClassService} from '../../setup/fund-source-budget-class/fund-source-budget-class.service';
import {FundSourceBudgetClass} from '../../setup/fund-source-budget-class/fund-source-budget-class.model';
import {PeDefinitionService} from '../../setup/pe-definition/pe-definition.service';
import {isNumeric} from 'rxjs/internal-compatibility';
import {FacilityService} from '../../setup/facility/facility.service';
import {Facility} from '../../setup/facility/facility.model';
import {BudgetCeilingService} from '../../shared/budget-ceiling.service';
import {ActivityInputService} from "../activity-input/activity-input.service";

@Component({
  selector: 'app-pe-item',
  templateUrl: './pe-item.component.html',
  styleUrls: ['./pe-item.component.scss'],
})
export class PeItemComponent implements OnInit {
  @ViewChild('paginator') paginator!: Paginator;
  @ViewChild('table') table!: Table;
  peItems?: PeItem[] = [];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  peSubForms?: any[] = [];
  budgetClasses?: BudgetClass[] = [];
  fundSources?: FundSource[] = [];
  sections?: Section[] = [];
  facilities?: any = [];
  selectedRowsArray?: any = []; //seletec rows tobe deleted
  selectedRowsIndexArray?: any = []; //seletec rows tobe deleted

  fetchedFundSources?: FundSource[] = []; // it hold the fund sources fetched from pe forms

  /* dynamic table values */
  round: any[] = [];
  inputTexts: any[] = [];
  peTableFields: any = [];
  peDataValues: any = [];
  verticalTotal: any = {};
  peValuesArray: any = {};
  dataReady = false;
  deleteButton?: MenuItem[];

  cols = []; //Table display columns
  isLoading = false;
  page?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects
  cellingAmount: any = 0;
  budgetedAmount: any = 0;
  balanceAmount: any = 0;
  defaultValue: any = null;
  selectRow?: string;
  financialYear: any = null;


  //Mandatory filter
  admin_hierarchy_id!: number;
  admin_hierarchy_code!: string;
  financial_year_id!: number;
  is_current_budget_locked!: boolean;
  pe_sub_form_id!: number;
  budget_class_id!: number;
  fund_source_id!: number;
  section_id!: number;
  pe_form_id!: number;
  currentUser?: User;
  parent_sub_budget_class?: any;
  yearRange?: string;
  councilHQFacilityCode?: string;
  isTableReady?: boolean = false

  constructor(
    protected peItemService: PeItemService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected peSubFormService: PeSubFormService,
    protected budgetClassService: BudgetClassService,
    protected fundSourceService: FundSourceService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected userService: UserService,
    protected peFormServices: PeFormService,
    protected fundSourceBudgetClassService: FundSourceBudgetClassService,
    protected peDefinitionService: PeDefinitionService,
    protected facilityService: FacilityService,
    protected budgetCeilingService: BudgetCeilingService,
    protected activityInputService: ActivityInputService
  ) {
    this.currentUser = userService.getCurrentUser();
    if (this.currentUser.admin_hierarchy) {
      this.adminHierarchies?.push(this.currentUser.admin_hierarchy);
      this.admin_hierarchy_id = this.currentUser.admin_hierarchy?.id!;
      this.financial_year_id = this.currentUser.admin_hierarchy?.current_financial_year_id!
      this.is_current_budget_locked = this.currentUser.admin_hierarchy?.is_current_budget_locked!
      this.admin_hierarchy_code = this.currentUser.admin_hierarchy?.code!
    }
  }

  ngOnInit(): void {
    this.peSubFormService
      .getParentChildren()
      .subscribe(
        (resp: CustomResponse<PeSubForm[]>) => (this.peSubForms = resp.data)
      );

    this.sectionService.peCostCenters().subscribe(
      (resp: CustomResponse<Section[]>) => {
        this.sections = resp.data
      }
    )

    if (this.admin_hierarchy_id) {
     this.councilHQFacilityCode = '0000' + this.admin_hierarchy_code
      this.facilityService
        .query({
          columns: ['id', 'name', 'code'],
          admin_hierarchy_id: this.admin_hierarchy_id,
          code: this.councilHQFacilityCode,
        })
        .subscribe(
          (resp: CustomResponse<Facility[]>) => {
            this.facilities = resp.data
          }
        );
    }

    
    this.financialYearService.findByStatus(1).subscribe(
      (resp: CustomResponse<FinancialYear>) => {
        if(resp.data){
         this.financialYear =  resp.data.name!
        } else {
          this.toastService.error('Planning Financial Year is not defined');
        }
       }
    )

    this.splitButtons();
    this.handleNavigation();
    this.calenderYearRange();
  }

  splitButtons() {
    this.deleteButton = [
      {
        label: 'Delete last row',
        icon: 'pi pi-times',
        command: () => {
          this.delete(this.round.length);
        },
      },
      {
        label: 'Delete selected row',
        icon: 'pi pi-trash',
        command: () => {
          this.deleteSelectedRows();
        },
      },
    ];
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.pe_sub_form_id ||
      !this.budget_class_id ||
      !this.fund_source_id ||
      !this.section_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.peItemService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        pe_sub_form_id: this.pe_sub_form_id,
        budget_class_id: this.budget_class_id,
        fund_source_id: this.fund_source_id,
        section_id: this.section_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<PeItem[]>) => {
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
    this.peDataValues = [];
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      this.budget_class_id <= 0 ||
      this.fund_source_id <= 0 ||
      !this.pe_form_id ||
      !this.section_id
    ) {
      return;
    }

    if (this.facilities[0]?.id !== undefined) {
      /** first fetch ceiling amount */
      this.fetchCeilingAmount();
      this.peTableFields = [];
      this.peDefinitionService
        .getParentChildrenByFormId({
          pe_form_id: this.pe_form_id,
          pe_sub_form_id: this.pe_sub_form_id,
        })
        .subscribe((resp) => {
          this.peTableFields = resp.data;
          if (this.round.length === 0) {
            this.addRow(0);
            this.preparation();
          } else {
            for (let i = this.round.length; i > 1; i--) {
              this.inputTexts[i] = [];
              this.round.pop();
            }
            this.round.pop();
            this.addRow(0);
            this.preparation();
          }
          /** the fetch dataValue*/
          this.fetchDataValues();
          this.isTableReady = true;
        });
    } else {
      this.toastService.error('Facility HQ with code node  '+this.councilHQFacilityCode+' defined');
    }
  }

  fetchDataValues() {
    if (this.facilities[0]?.id) {
      this.peItemService
        .fetchDataValues({
          financial_year_id: this.financial_year_id,
          admin_hierarchy_id: this.admin_hierarchy_id,
          section_id: this.section_id,
          facility_id: this.facilities[0]?.id,
          budget_class_id: this.budget_class_id,
          fund_source_id: this.fund_source_id,
          pe_sub_form_id: this.pe_sub_form_id,
        })
        .subscribe((resp) => {
          this.budgetedAmount = resp.data.budgetedAmount;
          if (resp.data.rows.length === 1) {
            /** sync data value */
          } else if (resp.data.rows.length >= 1) {
            /** increase row and add dataValue */
            for (let i = 1; i < resp.data.rows.length; i++) {
              this.addRow(i);
            }
          }
          /** Update dataValue fetched */
          this.updateFetchedDataValues(resp.data.dataValues);
          /** Update dataValue fetched */
          this.budgetBalance();
        });
    }
  }

  updateFetchedDataValues(fetchedDataValues: any) {
    if (fetchedDataValues.length > 0) {
      /** copy all object to peValueArray */
      this.round?.forEach((r) => {
        this.peValuesArray[r.uid] = {};
        fetchedDataValues?.forEach((f: any) => {
          const exist = this.peDataValues?.find((pdv: any) => {
            return pdv.uid === r.uid && pdv.id === f.pe_definition_id;
          });
          this.peValuesArray[r.uid!][f.pe_definition_id!] = {
            ...(exist ? exist : undefined),
          };
        });
      });

      /**iterate all fetched dataValues */
      fetchedDataValues?.forEach((fetched: any) => {
        /** Assign data Value used as display on html */
        const exist = this.peDataValues?.find((pedv: any) => {
          return (
            pedv.uid === fetched.row_uid && pedv.id === fetched.pe_definition_id
          );
        });
        this.peValuesArray[fetched.row_uid!][fetched.pe_definition_id!].value =
          fetched?.field_value ? fetched?.field_value : 0;

        /** Assign data Value used as to hold value for backEnd uses by using Index */
        const index = this.peDataValues?.findIndex((pedv: any) => {
          return (
            pedv.uid === fetched.row_uid && pedv.id === fetched.pe_definition_id
          );
        });
        this.peDataValues[index].value = fetched.field_value ? fetched.field_value : 0;

        /** if row number is greater than one */
        // if (this.round.length > 1) {
        this.getVerticalTotal(exist); // per last row
        //}
      });
    }
  }

  /** used to fetch ceiling Amount */
  fetchCeilingAmount() {
    if (this.facilities[0]?.id) {
      this.budgetCeilingService
        .query({
          columns: ['id', 'amount', 'facility_id'],
          admin_hierarchy_id: this.admin_hierarchy_id,
          facility_id: this.facilities[0]?.id,
          financial_year_id: this.financial_year_id,
          section_id: this.section_id,
          budget_type: 'CURRENT',
          fund_source_id: this.fund_source_id,
          budget_class_id: this.budget_class_id,
          per_page: 1000
        })
        .subscribe((resp) => {
          let amount = 0;
          if (resp.data?.length) {
            resp.data?.forEach((d: any) => {
              amount += parseFloat(d.amount);
            });
          }
          this.cellingAmount = amount;
        });
    }
  }

  fetchBudgetAmount() {
    this.activityInputService.query({
      columns: ['id', 'unit_price', 'quantity', 'frequency'],
      admin_hierarchy_id: this.admin_hierarchy_id,
      facility_id: this.facilities[0]?.id,
      financial_year_id: this.financial_year_id,
      section_id: this.section_id,
      budget_class_id: this.budget_class_id,
      fund_source_id: this.fund_source_id,
      per_page: 1000
    }).subscribe((resp) => {
      let amount = 0;
      if (resp.data?.length) {
        resp.data?.forEach((d: any) => {
          amount += (parseFloat(d.unit_price) * parseInt(d.quantity) * parseInt(d.frequency));
        });
      }
      this.budgetedAmount = amount;
      this.budgetBalance();
    })
  }

  /** check balance, ceiling - budget */
  budgetBalance() {
    this.balanceAmount =
      parseFloat(this.cellingAmount) - parseFloat(this.budgetedAmount);
  }

  /** on change pe sub form search Pe Form(parent) by id and Get budget class assignee*/
  getPeForm(event: any): void {
    if (event.value?.id >= 1) {
      this.budgetClasses! = [];
      this.budget_class_id = 0;
      this.fund_source_id = 0;
      this.pe_sub_form_id = event.value?.id;
      this.peFormServices.find(event.value?.pe_form_id).subscribe((resp) => {
        this.budgetClasses = resp.data?.budget_classes;
        this.fetchedFundSources = resp.data?.fund_sources;
        this.pe_form_id = event.value?.pe_form_id;
        this.filterChanged();
      });
    } else {
      this.budgetClasses = [];
      this.fetchedFundSources = [];
      this.fundSources = [];
    }
  }

  /** on change budget class search fund sources from ceilings */
  getFundSources(event: any): void {
    let budgetClassId = event.value;
    this.fund_source_id = 0;
    if (
      this.fetchedFundSources != null ||
      this.fetchedFundSources != undefined
    ) {
      this.fundSourceBudgetClassService
        .getFundSourceByBudgetClass({
          budget_class_id: budgetClassId,
          fund_source: JSON.stringify(this.fetchedFundSources),
        })
        .subscribe((resp) => {
          this.fundSources = resp.data?.fund_sources;
          this.filterChanged();
        });
    } else {
      this.fundSources = [];
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

  /** Clear search params */
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
   * Creating or updating PeItem
   * @param peItem ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(peItem?: PeItem): void {
    const data: PeItem = peItem ?? {
      ...new PeItem(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      pe_sub_form_id: this.pe_sub_form_id,
      budget_class_id: this.budget_class_id,
      fund_source_id: this.fund_source_id,
      section_id: this.section_id,
    };
    const ref = this.dialogService.open(PeItemUpdateComponent, {
      data,
      header: 'Create/Update PeItem',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * When successfully data loaded
   * @param resp
   * @param page
   * @param navigate
   */
  protected onSuccess(
    resp: CustomResponse<PeItem[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/pe-item'], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? 'id' + ':' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.peItems = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error('Error loading Pe Item');
  }

  /**
   * Delete PeItem
   * @param peItem
   */
  delete(position: number): void {
    this.confirmationService.confirm({
      message: 'Do you want to remove the last row?',
      accept: () => {
        this.deleteRow(position);
      },
    });
  }

  /** function used when new row added */
  addRow(position: number) {
    if (
      this.peTableFields.textInputs?.length > 0 &&
      this.isCriteriaMeet() &&
      this.pe_sub_form_id
    ) {
      this.inputTexts[position] = this.peTableFields.textInputs;

      /**create object of round */
      let roundObject: any = {};
      roundObject.id = position;
      roundObject.uid = `${this.getRoundUniqueId()}-${position}`; // get unique uid
      this.modifyPayload(
        this.inputTexts[position],
        `${this.getRoundUniqueId()}-${position}`,
        position
      ); //format payload
      this.round.push(roundObject);
    }

    /** call all prepare array of each input*/
    this.preparation();
  }

  /**
   Each row added format individual textInput  and Create payload
   then add mandatory fields as attributes
   then push to peDataValues ready for receiving input value
   */
  modifyPayload(payloads: any, uid: any, roundId: number) {
    payloads?.forEach((r: any) => {
      let object: any = {
        ...r,
        uid: uid,
        roundId: roundId,
      };
      this.peDataValues.push(object);
    });
  }

  /**Function for deleting rows where id greater than one */
  deleteRow(position: number) {
    if (position > 1) {
      this.round.pop();
      /** then remove arrays of all fields */
      this.peTableFields.textInputs?.forEach((value: any) => {
        this.peDataValues.pop();
      });
    }
  }

  /** This function check if all mandatory field selected, return true if selected, false if nor*/
  isCriteriaMeet() {
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      this.budget_class_id <= 0 ||
      this.fund_source_id <= 0 ||
      !this.pe_form_id ||
      !this.section_id
    ) {
      return false;
    } else {
      return true;
    }
  }

  store() {
    const object: any = {
      dataValues: this.peDataValues,
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      section_id: this.section_id,
      budget_class_id: this.budget_class_id,
      fund_source_id: this.fund_source_id,
      pe_form_id: this.pe_form_id,
      pe_sub_form_id: this.pe_sub_form_id,
      facility_id: this.facilities[0]?.id,
      ceiling_amount: this.cellingAmount,
      balanceAmount: this.balanceAmount,
    };


    this.peItemService.create(object).subscribe((response) => {
      if (response.success) {
        //this.fetchBudgetAmount();
        this.toastService.info(response.message);
      } else {
        this.toastService.error(response.message);
      }
    });
  }

  updateValue(data: any) {
    if (data?.value !== undefined && data?.value >= 0) {
      const objectIndex = this.peDataValues?.findIndex((pdv: any) => {
        return pdv.uid === data.uid && pdv.id === data.id;
      });
      this.peDataValues[objectIndex].value = data.value ? data.value : '';
      /** Remove select_option */
      delete this.peDataValues[objectIndex]?.select_option;
      this.horizontalTotal(data); // per column parent
      /** if row number is greater than one */
      if (this.round.length > 1) {
        this.getVerticalTotal(data); // per last row
      }
      /** For accuracy, Re update function call, to make sure if any skipped value is there
       *But this functions has not importance
       * */
      this.reUpdateValue(data);
    }
  }

  reUpdateValue(data: any) {
    if (data?.value !== undefined) {
      const objectIndex = this.peDataValues?.findIndex((pdv: any) => {
        return pdv.uid === data.uid && pdv.id === data.id;
      });
      this.peDataValues[objectIndex].value = data.value ? data.value : '';
      /** Remove select_option */
      delete this.peDataValues[objectIndex]?.select_option;
      this.horizontalTotal(data); // per column parent
      /** if row number is greater than one */
      if (this.round.length > 1) {
        this.getVerticalTotal(data); // per last row
      }
    }
  }

  /** sam vertical total */
  getVerticalTotal(data: any) {
    if (data.type === 'number' || data.output_type === 'CURRENCY') {
      const filtered = this.peDataValues?.filter(
        (value: any) => value.id === data.id
      );
      var verticalTotal = 0;
      filtered?.forEach((fValue: any) => {
        let value = parseFloat(fValue?.value) ? parseFloat(fValue?.value) : 0;
        verticalTotal = verticalTotal + value;
      });
      this.verticalTotal[data.id!] = verticalTotal.toFixed(2);
    }
  }

  /** Calculate vertical for horizontal total */
  getSamVerticalTotal(data: any) {
    const columnTotals = this.peDataValues?.filter(
      (value: any) => value.id === data.id
    );
    var total = 0;
    columnTotals.forEach((tcolum: any) => {
      let value =
        isNumeric(tcolum?.value) === true ? parseFloat(tcolum?.value) : 0;
      total = total + value;
    });
    this.verticalTotal[data.id!] = total.toFixed(2);
  }

  /** Calculate vertical total */
  horizontalTotal(data: any) {
    if (data.output_type === 'CURRENCY' || data.type === 'number') {
      /** filter  to find columns than contain totals*/
      const columnTotals = this.peDataValues?.filter(
        (value: any) =>
          value.parent_id === data.parent_id &&
          value.uid === data.uid &&
          value.formula !== null &&
          value.formula !== ''
      );
      columnTotals.forEach((tcolum: any) => {
        /** get vertical for horizontal total */
        let formula = tcolum.formula;
        let columnArrays = formula.split(/[.\*+-/_]/);
        columnArrays.forEach((column: any) => {
          /** find all columns */
          const filtered = this.peDataValues?.filter(
            (value: any) =>
              value.parent_id === data.parent_id &&
              value.column_number === column &&
              value.uid === data.uid
          );
          let dataValue =
            isNumeric(filtered[0]?.value) === true
              ? parseFloat(filtered[0]?.value)
              : 0;
          formula = formula.replace(column, dataValue);
        });

        /**find the index of object and update value key */
        const objectIndex = this.peDataValues?.findIndex((pdv: any) => {
          return pdv.uid === tcolum.uid && pdv.id === tcolum.id;
        });

        let calculatedValue =
          isNumeric(eval(formula)) === true ? parseFloat(eval(formula)) : 0;
        this.peDataValues[objectIndex].value = calculatedValue.toFixed(2);
        this.peValuesArray[tcolum.uid!][tcolum.id].value =
          calculatedValue.toFixed(2);

        // if row number is greater than one
        if (this.round.length > 1) {
          this.getSamVerticalTotal(tcolum);
        }
      });
    }
  }

  /** Prepare payload arrays and bind to roundId and InputIds to each textInput */
  preparation() {
    this.round?.forEach((r) => {
      this.peValuesArray[r.uid] = {};
      this.peTableFields.textInputs?.forEach((f: any) => {
        const exist = this.peDataValues?.find((pdv: any) => {
          return pdv.uid === r.uid && pdv.id === f.id;
        });

        this.peValuesArray[r.uid][f.id] = {
          ...(exist ? exist : undefined),
        };
      });
    });
    this.dataReady = true;
  }

  /** Generate round/table row unique Id id added
   * The id is based on
   * FinancialYearId, adminHierarchyId, CostCenterId ,peFormId ,peSubFormId,budgetClass,fundSource and serialNumber*/
  getRoundUniqueId() {
    return `${this.financial_year_id}-${this.admin_hierarchy_id}-${this.section_id}-${this.pe_form_id}-${this.pe_sub_form_id}`;
  }

  /** selected Row to be deleted */
  selectedRows(data: any, uid: any, rowId: number) {
    /** clear arrays */
    this.selectedRowsArray = [];
    this.selectedRowsIndexArray = [];

    const selectedItems = this.peDataValues?.filter((pdv: any) => {
      return pdv.uid === uid;
    });
    if (data.isTrusted) {
      this.selectedRowsIndexArray.push(rowId);
      /** used to display */
      selectedItems.forEach((value: any) => {
        this.selectedRowsArray.push(value);
      });
    } else {
      for (let i = 0; i < selectedItems.length; i++) {
        let object = selectedItems[i];
        let index = this.selectedRowsArray.findIndex((info: any) => {
          return info.uid === object.uid && info.id === object.id;
        });
        this.selectedRowsArray.splice(index, 1);
      }
      let rowIdIndex = this.selectedRowsIndexArray?.findIndex(
        (value: number) => value === rowId
      );
      this.selectedRowsIndexArray?.splice(rowIdIndex, 1);
    }
  }

  /** handle delete to the backend */
  handleDeleteSelectedRows() {
    const object = {
      dataValues: this.selectedRowsArray,
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      section_id: this.section_id,
      budget_class_id: this.budget_class_id,
      fund_source_id: this.fund_source_id,
      pe_form_id: this.pe_form_id,
      pe_sub_form_id: this.pe_sub_form_id,
      facility_id: this.facilities[0]?.id,
    };

    this.peItemService.deletePeLineValues(object).subscribe((resp) => {
      if (resp.success === true) {
        /** remove selected items to the arrays used to save to the backend */
        this.selectedRowsArray?.forEach((selected: any) => {
          const index = this.peDataValues.findIndex((all: any) => {
            return all.id === selected.id && all.uid === selected.uid;
          });
          this.peDataValues.splice(index, 1);
        });

        /** remove selected items display to html */

        this.peDataValues?.forEach((v: any) => {
          this.peValuesArray[v.uid!][v.id!].value = v.value ? v.value : '';
        });

        this.selectedRowsIndexArray?.forEach((index: number) => {
          this.round.splice(index, 1);
        });

        /** calculate new Vertical total */
        this.peDataValues.forEach((v: any) => {
          this.peValuesArray[v.uid!][v.id!].value = v.value ? v.value : '';
          this.getVerticalTotal(v);
        });

        /** clear arrays */
        this.selectedRowsArray = [];
        this.selectedRowsIndexArray = [];
        this.store();
        this.filterChanged();
      }
    });
  }

  /*** Delete */
  deleteSelectedRows() {
    this.confirmationService.confirm({
      message: 'Do you want to delete Personal Emolument Budget?',
      accept: () => {
        this.handleDeleteSelectedRows();
      },
    });
  }

  printPeFormStatus() {
    if (this.isCriteriaMeet() && this.facilities[0]?.id) {
      const object = {
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        budget_class_id: this.budget_class_id,
        fund_source_id: this.fund_source_id,
        pe_form_id: this.pe_form_id,
        pe_sub_form_id: this.pe_sub_form_id,
        facility_id: this.facilities[0]?.id,
        peTableFields: JSON.stringify(this.peTableFields),
      };
      this.peItemService.printPeFormStatus(object).subscribe((resp) => {
        let file = new Blob([resp], {type: 'application/pdf'});
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      });
    } else {
      this.toastService.error('Please make sure all filters are selected');
    }
  }

  calenderYearRange() {
    const year = new Date().getFullYear();
    this.yearRange = `${year}:${year + 6}`;
  }
}
