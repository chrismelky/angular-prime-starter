/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { CasPlan } from 'src/app/setup/cas-plan/cas-plan.model';
import { CasPlanService } from 'src/app/setup/cas-plan/cas-plan.service';
import { CasPlanContent } from '../cas-plan-content.model';
import { CasPlanContentService } from '../cas-plan-content.service';
import { ToastService } from 'src/app/shared/toast.service';
import {ReportSetup} from "../../report-setup/report-setup.model";
import {ReportSetupService} from "../../report-setup/report-setup.service";

@Component({
  selector: 'app-cas-plan-content-update',
  templateUrl: './cas-plan-content-update.component.html',
})
export class CasPlanContentUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  parents?: CasPlanContent[] = [];
  casPlans?: CasPlan[] = [];

  reports?: ReportSetup[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required, Validators.maxLength(255)]],
    parent_id: [null, []],
    report_id: [null, []],
    cas_plan_id: [null, [Validators.required]],
    sort_order: [null, [Validators.required, Validators.min(1)]],
  });

  constructor(
    protected casPlanContentService: CasPlanContentService,
    protected casPlanService: CasPlanService,
    protected reportSetupService: ReportSetupService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casPlanContentService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasPlanContent[]>) => (this.parents = resp.data)
      );
    this.casPlanService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasPlan[]>) => (this.casPlans = resp.data)
      );
    this.reportSetupService.query({ columns: ['id','name']})
      .subscribe(
        (resp:CustomResponse<ReportSetup[]>) => (this.reports = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasPlanContent Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casPlanContent = this.createFromForm();
    if (casPlanContent.id !== undefined) {
      this.subscribeToSaveResponse(
        this.casPlanContentService.update(casPlanContent)
      );
    } else {
      this.subscribeToSaveResponse(
        this.casPlanContentService.create(casPlanContent)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasPlanContent>>
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
   * @param casPlanContent
   */
  protected updateForm(casPlanContent: CasPlanContent): void {
    this.editForm.patchValue({
      id: casPlanContent.id,
      name: casPlanContent.name,
      parent_id: casPlanContent.parent_id,
      report_id: casPlanContent.report_id,
      cas_plan_id: casPlanContent.cas_plan_id,
      sort_order: casPlanContent.sort_order,
    });
  }

  /**
   * Return form values as object of type CasPlanContent
   * @returns CasPlanContent
   */
  protected createFromForm(): CasPlanContent {
    return {
      ...new CasPlanContent(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      parent_id: this.editForm.get(['parent_id'])!.value,
      report_id: this.editForm.get(['report_id'])!.value,
      cas_plan_id: this.editForm.get(['cas_plan_id'])!.value,
      sort_order: this.editForm.get(['sort_order'])!.value,
    };
  }
}
