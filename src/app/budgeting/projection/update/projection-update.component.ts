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
import { GfsCode } from "src/app/setup/gfs-code/gfs-code.model";
import { GfsCodeService } from "src/app/setup/gfs-code/gfs-code.service";
import { FundSource } from "src/app/setup/fund-source/fund-source.model";
import { FundSourceService } from "src/app/setup/fund-source/fund-source.service";
import { Projection } from "../projection.model";
import { ProjectionService } from "../projection.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-projection-update",
  templateUrl: "./projection-update.component.html",
})
export class ProjectionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  gfsCodes?: GfsCode[] = [];
  fundSources?: FundSource[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    projection_type_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    gfs_code_id: [null, [Validators.required]],
    fund_source_id: [null, [Validators.required]],
    active: [false, []],
    deleted: [false, []],
    q1_amount: [null, []],
    q2_amount: [null, []],
    q3_amount: [null, []],
    q4_amount: [null, []],
    amount: [null, []],
    forwad_year1_amount: [null, []],
    forwad_year2_amount: [null, []],
    chart_of_account: [null, []],
    export_to: [null, []],
    is_sent: [false, []],
    delivered: [false, []],
  });

  constructor(
    protected projectionService: ProjectionService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected gfsCodeService: GfsCodeService,
    protected fundSourceService: FundSourceService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminHierarchyService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.gfsCodeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<GfsCode[]>) => (this.gfsCodes = resp.data)
      );
    this.fundSourceService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create Projection or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const projection = this.createFromForm();
    if (projection.id !== undefined) {
      this.subscribeToSaveResponse(this.projectionService.update(projection));
    } else {
      this.subscribeToSaveResponse(this.projectionService.create(projection));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Projection>>
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
   * @param projection
   */
  protected updateForm(projection: Projection): void {
    this.editForm.patchValue({
      id: projection.id,
      projection_type_id: projection.projection_type_id,
      admin_hierarchy_id: projection.admin_hierarchy_id,
      financial_year_id: projection.financial_year_id,
      gfs_code_id: projection.gfs_code_id,
      fund_source_id: projection.fund_source_id,
      active: projection.active,
      deleted: projection.deleted,
      q1_amount: projection.q1_amount,
      q2_amount: projection.q2_amount,
      q3_amount: projection.q3_amount,
      q4_amount: projection.q4_amount,
      amount: projection.amount,
      forwad_year1_amount: projection.forwad_year1_amount,
      forwad_year2_amount: projection.forwad_year2_amount,
      chart_of_account: projection.chart_of_account,
      export_to: projection.export_to,
      is_sent: projection.is_sent,
      delivered: projection.delivered,
    });
  }

  /**
   * Return form values as object of type Projection
   * @returns Projection
   */
  protected createFromForm(): Projection {
    return {
      ...new Projection(),
      id: this.editForm.get(["id"])!.value,
      projection_type_id: this.editForm.get(["projection_type_id"])!.value,
      admin_hierarchy_id: this.editForm.get(["admin_hierarchy_id"])!.value,
      financial_year_id: this.editForm.get(["financial_year_id"])!.value,
      gfs_code_id: this.editForm.get(["gfs_code_id"])!.value,
      fund_source_id: this.editForm.get(["fund_source_id"])!.value,
      active: this.editForm.get(["active"])!.value,
      deleted: this.editForm.get(["deleted"])!.value,
      q1_amount: this.editForm.get(["q1_amount"])!.value,
      q2_amount: this.editForm.get(["q2_amount"])!.value,
      q3_amount: this.editForm.get(["q3_amount"])!.value,
      q4_amount: this.editForm.get(["q4_amount"])!.value,
      amount: this.editForm.get(["amount"])!.value,
      forwad_year1_amount: this.editForm.get(["forwad_year1_amount"])!.value,
      forwad_year2_amount: this.editForm.get(["forwad_year2_amount"])!.value,
      chart_of_account: this.editForm.get(["chart_of_account"])!.value,
      export_to: this.editForm.get(["export_to"])!.value,
      is_sent: this.editForm.get(["is_sent"])!.value,
      delivered: this.editForm.get(["delivered"])!.value,
    };
  }
}
