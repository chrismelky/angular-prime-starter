/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../utils/custom-response';
import { PER_PAGE_OPTIONS } from '../../config/pagination.constants';
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
  valueLoaded = false;

  isLoading = false;
  page?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects

  //Mandatory filter
  admin_hierarchy_id?: number;
  financial_year_id?: number;
  facility_type_id?: number;
  facility_id?: number;
  cas_plan_id?: number;
  period_id?: number;
  dataSet!: DataSet;
  currentUser?: User;
  tableHeaders: any[] = [];

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
    this.facility_id = undefined;
    this.prepareDataValuesArray();
    this.facilityTypes =
      this.dataSet && this.dataSet.facility_types
        ? JSON.parse(this.dataSet.facility_types)
        : [];
    this.periods =
      this.dataSet && this.dataSet.periods
        ? JSON.parse(this.dataSet.periods)
        : [];
  }

  private resetForm(): void {
    this.prepareDataValuesArray();
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
          'data_element_group_id',
        ],
        with: ['optionSet', 'optionSet.options', 'group'],
      })
      .subscribe((resp: CustomResponse<DataElement[]>) => {
        this.dataElements = resp.data?.map((de) => {
          return {
            ...de,
            groupName: de.group ? de.group.name : 'NONE',
          };
        });
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
      console.log(resp.data);
      this.categoryCombinations = resp.data?.map((cc) => {
        return {
          ...cc,
          dataElementGroups: this.helper.groupBy(
            this.dataElements?.filter(
              (de) => de.category_combination_id === cc.id
            )!,
            'groupName'
          ),
        };
      });
      this.prepareDataValuesArray();
    });
  }

  loadDataValues(): void {
    this.valueLoaded = false;
    this.dataValues = [];
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
      .subscribe(
        (resp) => {
          this.dataValues = resp.data;
          this.prepareDataValuesArray();
          this.valueLoaded = true;
        },
        (error) => {
          this.valueLoaded = true;
          this.prepareDataValuesArray();
        }
      );
  }

  prepareDataValuesArray(): void {
    this.dataElements?.forEach((de) => {
      this.dataValuesArray[de.id!] = {};
      this.categoryCombinations?.forEach((co) => {
        if (de.category_combination_id === co.id) {
          co.category_option_combinations?.forEach((coc) => {
            coc.value_type = coc.value_type || de.value_type;
            coc.option_set_id = coc.option_set_id || de.option_set_id;
            coc.option_set = coc.option_set || de.option_set;

            const existing = this.dataValues?.find((dv) => {
              return (
                dv.data_element_id === de.id &&
                dv.category_option_combination_id === coc.id
              );
            });
            this.dataValuesArray[de.id!][coc.id!] = {
              id: existing ? existing.id : undefined,
              value: existing ? existing.value : undefined,
              oldValue: existing ? existing.value : undefined,
              isSaving: false,
              isSaved: false,
              hasError: false,
              data_element_id: de.id,
              category_option_combination_id: coc.id,
            };
          });
        }
      });
    });
  }

  saveValue(event: any, dataValue: any): void {
    console.log(event);
    console.log(dataValue);
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.period_id ||
      !this.facility_id
    ) {
      return;
    }
    dataValue = {
      ...dataValue,
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      facility_id: this.facility_id,
      period_id: this.period_id,
    };
    if (
      dataValue.value !== undefined &&
      dataValue.value !== null &&
      dataValue.value.toString() !== dataValue.oldValue
    ) {
      dataValue.isSaving = true;
      if (dataValue.id !== undefined) {
        this.dataValueService.update(dataValue).subscribe(
          (resp) => this.onSuccess(dataValue, resp.data!),
          (error) => this.onError(dataValue)
        );
      } else {
        this.dataValueService.create(dataValue).subscribe(
          (resp) => this.onSuccess(dataValue, resp.data!),
          (error) => this.onError(dataValue)
        );
      }
    }
  }

  protected onSuccess(dataValue: any, savedData: DataValue): void {
    this.dataValuesArray[dataValue.data_element_id][
      dataValue.category_option_combination_id
    ].oldValue = savedData?.value;
    this.dataValuesArray[dataValue.data_element_id][
      dataValue.category_option_combination_id
    ].id = savedData?.id;
    this.dataValuesArray[dataValue.data_element_id][
      dataValue.category_option_combination_id
    ].isSaved = true;
    this.dataValuesArray[dataValue.data_element_id][
      dataValue.category_option_combination_id
    ].hasError = false;
  }

  protected onError(dataValue: any): void {
    this.dataValuesArray[dataValue.data_element_id][
      dataValue.category_option_combination_id
    ].isSaved = false;

    this.dataValuesArray[dataValue.data_element_id][
      dataValue.category_option_combination_id
    ].hasError = true;
  }

  fileUploader($event: any, dataValue: DataValue): void {
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.period_id ||
      !this.facility_id
    ) {
      return;
    }
    const formData = new FormData();
    formData.append('admin_hierarchy_id', this.admin_hierarchy_id!.toString());
    formData.append('financial_year_id', this.financial_year_id!.toString());
    formData.append('period_id', this.period_id!.toString());
    formData.append('facility_id', this.facility_id!.toString());
    formData.append('data_element_id', dataValue.data_element_id!.toString());
    formData.append(
      'category_option_combination_id',
      dataValue.category_option_combination_id!.toString()
    );
    formData.append('file', $event.files[0]);

    this.dataValueService.upload(formData).subscribe((resp) => {
      console.log(resp);
    });
  }

  filterByCategoryCombo(id: number): any {
    const des = this.dataElements?.filter(
      (de) => de.category_combination_id === id
    )!;
    const grouped = this.helper.groupBy(des, 'groupName');
    console.log(grouped);
    return [];
  }

  /**
   * Load Facilities by parent admin hierarchy and facility Type
   */
  loadFacilities(): void {
    this.facilityService
      .search(
        this.facility_type_id!,
        this.parentAdminName,
        this.admin_hierarchy_id!
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
}
