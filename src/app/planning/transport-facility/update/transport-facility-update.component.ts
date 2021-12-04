/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { CustomResponse } from "../../../utils/custom-response";
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";
import { AssetCondition } from "src/app/setup/asset-condition/asset-condition.model";
import { AssetConditionService } from "src/app/setup/asset-condition/asset-condition.service";
import { AssetUse } from "src/app/setup/asset-use/asset-use.model";
import { AssetUseService } from "src/app/setup/asset-use/asset-use.service";
import { TransportCategory } from "src/app/setup/transport-category/transport-category.model";
import { TransportCategoryService } from "src/app/setup/transport-category/transport-category.service";
import { TransportFacility } from "../transport-facility.model";
import { TransportFacilityService } from "../transport-facility.service";
import { ToastService } from "src/app/shared/toast.service";
import { EnumService, PlanrepEnum } from 'src/app/shared/enum.service';
import {User} from "../../../setup/user/user.model";
import {UserService} from "../../../setup/user/user.service";


@Component({
  selector: "app-transport-facility-update",
  templateUrl: "./transport-facility-update.component.html",
})
export class TransportFacilityUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  assetConditions?: AssetCondition[] = [];
  assetUses?: AssetUse[] = [];
  transportCategories?: TransportCategory[] = [];
  ownerships?: PlanrepEnum[] = [];
  insuranceTypes?: PlanrepEnum[] = [];
  currentUser?: User;

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    registration_number: [null, [Validators.required]],
    date_of_acquisition: [null, [Validators.required]],
    mileage: [null, [Validators.required]],
    type: [null, [Validators.required]],
    comment: [null, [Validators.required]],
    station: [null, [Validators.required]],
    ownership: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    asset_condition_id: [null, [Validators.required]],
    asset_use_id: [null, [Validators.required]],
    transport_category_id: [null, [Validators.required]],
    insurance_type: [null, [Validators.required]],
  });

  constructor(
    protected transportFacilityService: TransportFacilityService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected assetConditionService: AssetConditionService,
    protected assetUseService: AssetUseService,
    protected transportCategoryService: TransportCategoryService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService,
    protected userService: UserService,
  ) {
    this.currentUser = userService.getCurrentUser();
    if (this.currentUser.admin_hierarchy) {
      this.adminHierarchies?.push(this.currentUser.admin_hierarchy);
    }
  }

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.assetConditionService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AssetCondition[]>) =>
          (this.assetConditions = resp.data)
      );
    this.assetUseService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AssetUse[]>) => (this.assetUses = resp.data)
      );
    this.transportCategoryService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<TransportCategory[]>) =>
          (this.transportCategories = resp.data)
      );
    this.ownerships = this.enumService.get('ownerships');
    this.insuranceTypes = this.enumService.get('insuranceTypes');
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create TransportFacility or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const transportFacility = this.createFromForm();
    if (transportFacility.id !== undefined) {
      this.subscribeToSaveResponse(
        this.transportFacilityService.update(transportFacility)
      );
    } else {
      this.subscribeToSaveResponse(
        this.transportFacilityService.create(transportFacility)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<TransportFacility>>
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
    this.dialogRef.close(true);
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

  /**
   * Set/Initialize form values
   * @param transportFacility
   */
  protected updateForm(transportFacility: TransportFacility): void {
    this.editForm.patchValue({
      id: transportFacility.id,
      name: transportFacility.name,
      registration_number: transportFacility.registration_number,
      date_of_acquisition:
        transportFacility.date_of_acquisition !== undefined
          ? new Date(transportFacility.date_of_acquisition!)
          : transportFacility.date_of_acquisition,
      mileage: transportFacility.mileage,
      type: transportFacility.type,
      comment: transportFacility.comment,
      station: transportFacility.station,
      ownership: transportFacility.ownership,
      admin_hierarchy_id: transportFacility.admin_hierarchy_id,
      financial_year_id: transportFacility.financial_year_id,
      asset_condition_id: transportFacility.asset_condition_id,
      asset_use_id: transportFacility.asset_use_id,
      transport_category_id: transportFacility.transport_category_id,
      insurance_type: transportFacility.insurance_type,
    });
  }

  /**
   * Return form values as object of type TransportFacility
   * @returns TransportFacility
   */
  protected createFromForm(): TransportFacility {
    return {
      ...new TransportFacility(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      registration_number: this.editForm.get(["registration_number"])!.value,
      date_of_acquisition: this.editForm.get(["date_of_acquisition"])!.value,
      mileage: this.editForm.get(["mileage"])!.value,
      type: this.editForm.get(["type"])!.value,
      comment: this.editForm.get(["comment"])!.value,
      station: this.editForm.get(["station"])!.value,
      ownership: this.editForm.get(["ownership"])!.value,
      admin_hierarchy_id: this.editForm.get(["admin_hierarchy_id"])!.value,
      financial_year_id: this.editForm.get(["financial_year_id"])!.value,
      asset_condition_id: this.editForm.get(["asset_condition_id"])!.value,
      asset_use_id: this.editForm.get(["asset_use_id"])!.value,
      transport_category_id: this.editForm.get(["transport_category_id"])!
        .value,
      insurance_type: this.editForm.get(["insurance_type"])!.value,
    };
  }
}
