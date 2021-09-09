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
import { DataElement } from 'src/app/setup/data-element/data-element.model';
import { DataElementService } from 'src/app/setup/data-element/data-element.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { Facility } from 'src/app/setup/facility/facility.model';
import { FacilityService } from 'src/app/setup/facility/facility.service';
import { CategoryOptionCombination } from 'src/app/setup/category-option-combination/category-option-combination.model';
import { CategoryOptionCombinationService } from 'src/app/setup/category-option-combination/category-option-combination.service';

import { DataValue } from './data-value.model';
import { DataValueService } from './data-value.service';
import { DataValueUpdateComponent } from './update/data-value-update.component';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { CasPlanService } from '../cas-plan/cas-plan.service';
import { CasPlan } from '../cas-plan/cas-plan.model';
import { DataSetService } from '../data-set/data-set.service';
import { DataSet } from '../data-set/data-set.model';
import { FacilityType } from '../facility-type/facility-type.model';
import { CategoryCombinationService } from '../category-combination/category-combination.service';
import { CategoryCombination } from '../category-combination/category-combination.model';
import { Period } from '../period/period.model';

@Component({
  selector: 'app-data-value',
  templateUrl: './data-value.component.html',
})
export class DataValueComponent implements OnInit {
  dataValues?: DataValue[] = [];

  dataElements?: DataElement[] = [];
  adminHierarchies: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  facilities?: Facility[] = [];
  facilityTypes?: FacilityType[] = [];
  periods?: Period[] = [];
  categoryOptionCombinations?: CategoryOptionCombination[] = [];
  categoryCombinations?: CategoryCombination[] = [];
  casPlans?: CasPlan[] = [];
  dataSets?: DataSet[] = [];
  dataValuesArray: any = {};
  parentAdminName!: string;

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
  financial_year_id!: number;
  facility_type_id!: number;
  facility_id!: number;
  cas_plan_id!: number;
  period_id!: number;
  dataSet!: DataSet;
  currentUser?: User;

  constructor(
    protected dataValueService: DataValueService,
    protected dataElementService: DataElementService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected facilityService: FacilityService,
    protected categoryOptionCombinationService: CategoryOptionCombinationService,
    protected casPlanService: CasPlanService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected userService: UserService,
    protected dataSetService: DataSetService,
    protected categoryCombinationService: CategoryCombinationService
  ) {
    this.currentUser = userService.getCurrentUser();
    if (this.currentUser.admin_hierarchy) {
      this.adminHierarchies?.push(this.currentUser.admin_hierarchy);
      this.admin_hierarchy_id = this.adminHierarchies[0].id!;
      this.parentAdminName = `p${this.currentUser.admin_hierarchy.admin_hierarchy_position}`;
    }
  }

  ngOnInit(): void {
    this.casPlanService
      .query({
        columns: ['id', 'name'],
      })
      .subscribe(
        (resp: CustomResponse<CasPlan[]>) => (this.casPlans = resp.data)
      );

    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );

    this.categoryOptionCombinationService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CategoryOptionCombination[]>) =>
          (this.categoryOptionCombinations = resp.data)
      );
  }

  /**
   * Load data set by cas plan
   */
  loadDataSets(): void {
    this.dataSetService
      .query({
        cas_plan_id: this.cas_plan_id,
        columns: ['id', 'name', 'facility_types', 'periods'],
      })
      .subscribe(
        (resp: CustomResponse<DataSet[]>) => (this.dataSets = resp.data)
      );
  }

  /**
   * Load facility types from dataset facility_type json property, see @DataSet model
   */
  onDataSetChange(): void {
    this.loadDataElements();
    this.facilityTypes =
      this.dataSet && this.dataSet.facility_types
        ? JSON.parse(this.dataSet.facility_types)
        : [];
    this.periods =
      this.dataSet && this.dataSet.periods
        ? JSON.parse(this.dataSet.periods)
        : [];
  }

  /**
   * Load data elements by data set
   */
  loadDataElements(): void {
    if (!this.dataSet) {
      return;
    }
    this.dataElementService
      .query({
        data_set_id: this.dataSet.id,
        columns: [
          'id',
          'name',
          'category_combination_id',
          'option_set_id',
          'is_required',
          'value_type',
        ],
      })
      .subscribe((resp: CustomResponse<DataElement[]>) => {
        this.dataElements = resp.data;
        this.loadCategoryCombinations();
      });
  }

  /**
   * Load Category Combinations used by loaded data set
   * This is used to group data elements with a common category combination
   * into same sub form
   */
  loadCategoryCombinations(): void {
    const ids: number[] = [];
    this.dataElements?.forEach((de) => {
      if (ids.indexOf(de.category_combination_id!) === -1) {
        ids.push(de.category_combination_id!);
      }
    });
    this.categoryCombinationService.getByIds({ ids }).subscribe((resp) => {
      this.categoryCombinations = resp.data;
      this.prepareDataValuesArray();
    });
  }

  loadDataValues(): void {
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.period_id ||
      !this.facility_id
    ) {
      return;
    }
    this.dataValueService
      .query({
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        facility_id: this.facility_id,
        period_id: this.period_id,
      })
      .subscribe((resp) => {
        this.dataValues = resp.data;
        this.prepareDataValuesArray();
      });
  }

  prepareDataValuesArray(): void {
    this.dataElements?.forEach((de) => {
      this.dataValuesArray[de.id!] = {};
      this.categoryCombinations?.forEach((co) => {
        co.category_option_combinations?.forEach((coc) => {
          const existing = this.dataValues?.find((dv) => {
            return (
              dv.data_element_id === de.id &&
              dv.category_option_combination_id === coc.id
            );
          });
          console.log(existing);
          this.dataValuesArray[de.id!][coc.id!] = {
            id: existing ? existing.id : undefined,
            value: existing ? existing.value : undefined,
            oldValue: existing ? existing.value : undefined,
            isSaving: false,
            data_element_id: de.id,
            category_option_combination_id: coc.id,
          };
        });
      });
    });
  }

  saveValue(dataValue: any): void {
    dataValue = {
      ...dataValue,
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      facility_id: this.facility_id,
      period_id: this.period_id,
    };
    if (
      dataValue.value !== dataValue.oldValue &&
      dataValue.value !== undefined
    ) {
      dataValue.isSaving = true;
      if (dataValue.id !== undefined) {
        this.dataValueService.update(dataValue).subscribe();
      } else {
        this.dataValueService.create(dataValue).subscribe();
      }
    }
  }

  filterByCategoryCombo(id: number): DataElement[] {
    return this.dataElements?.filter(
      (de) => de.category_combination_id === id
    )!;
  }

  /**
   * Load Facilities by parent admin hierarchy and facility Type
   */
  loadFacilities(): void {
    this.facilityService
      .search(
        this.facility_type_id,
        this.parentAdminName,
        this.admin_hierarchy_id
      )
      .subscribe(
        (resp: CustomResponse<Facility[]>) => (this.facilities = resp.data)
      );
  }

  /**
   * When filtering facility
   */
  onFacilityFilter($event: any): void {}

  counter(i: number) {
    return new Array(i + 1);
  }

  /**
   * Mandatory filter field changed;
   * Mandatory filter= fields that must be specified when requesting data
   * @param event
   */
  filterChanged(): void {
    this.loadDataValues();
    // this.dataValues = [];
    // this.prepareDataValuesArray();
  }

  /**
   * When error on loading data set data to empt and resert page to load
   */
  protected onError(): void {
    this.toastService.error('Error loading Data Value');
  }
}
