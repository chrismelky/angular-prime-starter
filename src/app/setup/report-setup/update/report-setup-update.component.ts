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
import {OrientationList, ReportSetup} from "../report-setup.model";
import { ReportSetupService } from "../report-setup.service";
import { ToastService } from "src/app/shared/toast.service";


@Component({
  selector: "app-report-setup-update",
  templateUrl: "./report-setup-update.component.html",
})
export class ReportSetupUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, []],
    template_name: [null, []],
    orientation: [null, []],
    query_params: [null, []],
    sql_query: [null, []],
  });
  orientations?: OrientationList[] = [];

  constructor(
    protected reportSetupService: ReportSetupService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.orientations = [
      {
        name:'Potrait',
        value:'potrait'
      },{
        name:'Landscape',
        value:'landscape'
      }
    ];
    //Initialize form with data from dialog
    this.updateForm(this.dialogConfig.data);
  }

  /**
   * When form is valid Create ReportSetup or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;

    const reportSetup = this.createFromForm();
    if (reportSetup.id !== undefined) {
      this.subscribeToSaveResponse(this.reportSetupService.update(reportSetup));
    } else {
      this.subscribeToSaveResponse(this.reportSetupService.create(reportSetup));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ReportSetup>>
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
   * @param reportSetup
   */
  protected updateForm(reportSetup: ReportSetup): void {
    this.editForm.patchValue({
      id: reportSetup.id,
      name: reportSetup.name,
      template_name: reportSetup.template_name,
      orientation: reportSetup.orientation,
      query_params: reportSetup.query_params,
      sql_query: reportSetup.sql_query,
    });
  }

  /**
   * Return form values as object of type ReportSetup
   * @returns ReportSetup
   */
  protected createFromForm(): ReportSetup {
    return {
      ...new ReportSetup(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      template_name: this.editForm.get(["template_name"])!.value,
      orientation: this.editForm.get(["orientation"])!.value,
      query_params: this.editForm.get(["query_params"])!.value,
      sql_query: this.editForm.get(["sql_query"])!.value,
    };
  }
}
