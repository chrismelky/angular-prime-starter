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
import { DataElementGroupSet } from "src/app/setup/data-element-group-set/data-element-group-set.model";
import { DataElementGroupSetService } from "src/app/setup/data-element-group-set/data-element-group-set.service";
import { DataElementGroup } from "../data-element-group.model";
import { DataElementGroupService } from "../data-element-group.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-data-element-group-update",
  templateUrl: "./data-element-group-update.component.html",
})
export class DataElementGroupUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  dataElementGroupSets?: DataElementGroupSet[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, []],
    data_element_group_set_id: [null, [Validators.required]],
  });

  constructor(
    protected dataElementGroupService: DataElementGroupService,
    protected dataElementGroupSetService: DataElementGroupSetService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.dataElementGroupSetService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<DataElementGroupSet[]>) =>
          (this.dataElementGroupSets = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create DataElementGroup or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const dataElementGroup = this.createFromForm();
    if (dataElementGroup.id !== undefined) {
      this.subscribeToSaveResponse(
        this.dataElementGroupService.update(dataElementGroup)
      );
    } else {
      this.subscribeToSaveResponse(
        this.dataElementGroupService.create(dataElementGroup)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<DataElementGroup>>
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
   * @param dataElementGroup
   */
  protected updateForm(dataElementGroup: DataElementGroup): void {
    this.editForm.patchValue({
      id: dataElementGroup.id,
      name: dataElementGroup.name,
      code: dataElementGroup.code,
      data_element_group_set_id: dataElementGroup.data_element_group_set_id,
    });
  }

  /**
   * Return form values as object of type DataElementGroup
   * @returns DataElementGroup
   */
  protected createFromForm(): DataElementGroup {
    return {
      ...new DataElementGroup(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      data_element_group_set_id: this.editForm.get([
        "data_element_group_set_id",
      ])!.value,
    };
  }
}
