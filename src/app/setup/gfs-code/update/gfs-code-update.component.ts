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
import { AccountType } from "src/app/setup/account-type/account-type.model";
import { AccountTypeService } from "src/app/setup/account-type/account-type.service";
import { Category } from "src/app/setup/category/category.model";
import { CategoryService } from "src/app/setup/category/category.service";
import { GfsCode } from "../gfs-code.model";
import { GfsCodeService } from "../gfs-code.service";
import { ToastService } from "src/app/shared/toast.service";
import {GfsCodeCategory} from "../../gfs-code-category/gfs-code-category.model";
import {GfsCodeCategoryService} from "../../gfs-code-category/gfs-code-category.service";

@Component({
  selector: "app-gfs-code-update",
  templateUrl: "./gfs-code-update.component.html",
})
export class GfsCodeUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  accountTypes?: AccountType[] = [];
  categories?: GfsCodeCategory[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    aggregated_code: [null],
    account_type_id: [null, [Validators.required]],
    category_id: [null, [Validators.required]],
    is_procurement: [false, []],
    is_protected: [false, []],
  });

  constructor(
    protected gfsCodeService: GfsCodeService,
    protected accountTypeService: AccountTypeService,
    protected categoryService: GfsCodeCategoryService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.accountTypeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AccountType[]>) => (this.accountTypes = resp.data)
      );
    this.categoryService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<GfsCodeCategory[]>) => (this.categories = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create GfsCode or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const gfsCode = this.createFromForm();
    if (gfsCode.id !== undefined) {
      this.subscribeToSaveResponse(this.gfsCodeService.update(gfsCode));
    } else {
      this.subscribeToSaveResponse(this.gfsCodeService.create(gfsCode));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<GfsCode>>
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
   * @param gfsCode
   */
  protected updateForm(gfsCode: GfsCode): void {
    this.editForm.patchValue({
      id: gfsCode.id,
      name: gfsCode.name,
      code: gfsCode.code,
      aggregated_code: gfsCode.aggregated_code,
      account_type_id: gfsCode.account_type_id,
      category_id: gfsCode.category_id,
      is_procurement: gfsCode.is_procurement,
      is_protected: gfsCode.is_protected,
    });
  }

  /**
   * Return form values as object of type GfsCode
   * @returns GfsCode
   */
  protected createFromForm(): GfsCode {
    return {
      ...new GfsCode(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      aggregated_code: this.editForm.get(["aggregated_code"])!.value,
      account_type_id: this.editForm.get(["account_type_id"])!.value,
      category_id: this.editForm.get(["category_id"])!.value,
      is_procurement: this.editForm.get(["is_procurement"])!.value,
      is_protected: this.editForm.get(["is_protected"])!.value,
    };
  }
}
