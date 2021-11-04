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
import { CasPlanContent } from "src/app/setup/cas-plan-content/cas-plan-content.model";
import { CasPlanContentService } from "src/app/setup/cas-plan-content/cas-plan-content.service";
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";
import { Report } from "../report.model";
import { ReportService } from "../report.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-report-update",
  templateUrl: "./report-update.component.html",
})
export class ReportUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  casPlanContents?: CasPlanContent[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    cas_plan_content_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
  });

  constructor(
    protected reportService: ReportService,
    protected casPlanContentService: CasPlanContentService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casPlanContentService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<CasPlanContent[]>) =>
          (this.casPlanContents = resp.data)
      );
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
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create Report or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const report = this.createFromForm();
    if (report.id !== undefined) {
      this.subscribeToSaveResponse(this.reportService.update(report));
    } else {
      this.subscribeToSaveResponse(this.reportService.create(report));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Report>>
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
   * @param report
   */
  protected updateForm(report: Report): void {
    this.editForm.patchValue({
      id: report.id,
      cas_plan_content_id: report.cas_plan_content_id,
      admin_hierarchy_id: report.admin_hierarchy_id,
      financial_year_id: report.financial_year_id,
    });
  }

  /**
   * Return form values as object of type Report
   * @returns Report
   */
  protected createFromForm(): Report {
    return {
      ...new Report(),
      id: this.editForm.get(["id"])!.value,
      cas_plan_content_id: this.editForm.get(["cas_plan_content_id"])!.value,
      admin_hierarchy_id: this.editForm.get(["admin_hierarchy_id"])!.value,
      financial_year_id: this.editForm.get(["financial_year_id"])!.value,
    };
  }
}
