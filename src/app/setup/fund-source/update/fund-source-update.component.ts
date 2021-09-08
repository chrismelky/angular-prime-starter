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
import { GfsCode } from "src/app/setup/gfs-code/gfs-code.model";
import { GfsCodeService } from "src/app/setup/gfs-code/gfs-code.service";
import { FundSourceCategory } from "src/app/setup/fund-source-category/fund-source-category.model";
import { FundSourceCategoryService } from "src/app/setup/fund-source-category/fund-source-category.service";
import { FundSource } from "../fund-source.model";
import { FundSourceService } from "../fund-source.service";
import { ToastService } from "src/app/shared/toast.service";
import {Sector} from "../../sector/sector.model";
import {SectorService} from "../../sector/sector.service";

@Component({
  selector: "app-fund-source-update",
  templateUrl: "./fund-source-update.component.html",
})
export class FundSourceUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  sectors?: Sector[] = [];
  errors = [];

  gfsCodes?: GfsCode[] = [];
  fundSourceCategories?: FundSourceCategory[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, []],
    gfs_code_id: [null, [Validators.required]],
    fund_source_category_id: [null, [Validators.required]],
    is_conditional: [false, []],
    is_foreign: [false, []],
    is_treasurer: [false, []],
    can_project: [false, []],
    is_active: [true, []],
  });

  constructor(
    protected fundSourceService: FundSourceService,
    protected gfsCodeService: GfsCodeService,
    protected fundSourceCategoryService: FundSourceCategoryService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.gfsCodeService
      .queryRev({ columns: ["id",'code',"name"] })
      .subscribe(
        (resp: CustomResponse<GfsCode[]>) => (this.gfsCodes = resp.data)
      );
    this.fundSourceCategoryService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundSourceCategory[]>) =>
          (this.fundSourceCategories = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create FundSource or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const fundSource = this.createFromForm();
    if (fundSource.id !== undefined) {
      this.subscribeToSaveResponse(this.fundSourceService.update(fundSource));
    } else {
      this.subscribeToSaveResponse(this.fundSourceService.create(fundSource));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FundSource>>
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
   * @param fundSource
   */
  protected updateForm(fundSource: FundSource): void {
    this.editForm.patchValue({
      id: fundSource.id,
      name: fundSource.name,
      code: fundSource.code,
      gfs_code_id: fundSource.gfs_code_id,
      fund_source_category_id: fundSource.fund_source_category_id,
      is_conditional: fundSource.is_conditional,
      is_foreign: fundSource.is_foreign,
      is_treasurer: fundSource.is_treasurer,
      can_project: fundSource.can_project,
      is_active: fundSource.is_active,
    });
  }

  /**
   * Return form values as object of type FundSource
   * @returns FundSource
   */
  protected createFromForm(): FundSource {
    return {
      ...new FundSource(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      gfs_code_id: this.editForm.get(["gfs_code_id"])!.value,
      fund_source_category_id: this.editForm.get(["fund_source_category_id"])!
        .value,
      is_conditional: this.editForm.get(["is_conditional"])!.value,
      is_foreign: this.editForm.get(["is_foreign"])!.value,
      is_treasurer: this.editForm.get(["is_treasurer"])!.value,
      can_project: this.editForm.get(["can_project"])!.value,
      is_active: this.editForm.get(["is_active"])!.value,
    };
  }
}
