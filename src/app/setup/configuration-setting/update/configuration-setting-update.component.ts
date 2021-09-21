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
import { EnumService, PlanrepEnum } from "src/app/shared/enum.service";
import { ConfigurationSetting } from "../configuration-setting.model";
import { ConfigurationSettingService } from "../configuration-setting.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-configuration-setting-update",
  templateUrl: "./configuration-setting-update.component.html",
})
export class ConfigurationSettingUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  valueTypes?: PlanrepEnum[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    key: [null, [Validators.required]],
    value: [null, []],
    name: [null, [Validators.required]],
    group_name: [null, [Validators.required]],
    value_type: [null, [Validators.required]],
    value_options: [null, []],
    value_option_query: [null, []],
  });

  constructor(
    protected configurationSettingService: ConfigurationSettingService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.valueTypes = this.enumService.get("valueTypes");
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ConfigurationSetting or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const configurationSetting = this.createFromForm();
    if (configurationSetting.id !== undefined) {
      this.subscribeToSaveResponse(
        this.configurationSettingService.update(configurationSetting)
      );
    } else {
      this.subscribeToSaveResponse(
        this.configurationSettingService.create(configurationSetting)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ConfigurationSetting>>
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
   * @param configurationSetting
   */
  protected updateForm(configurationSetting: ConfigurationSetting): void {
    this.editForm.patchValue({
      id: configurationSetting.id,
      key: configurationSetting.key,
      value: configurationSetting.value,
      name: configurationSetting.name,
      group_name: configurationSetting.group_name,
      value_type: configurationSetting.value_type,
      value_options: configurationSetting.value_options,
      value_option_query: configurationSetting.value_option_query,
    });
  }

  /**
   * Return form values as object of type ConfigurationSetting
   * @returns ConfigurationSetting
   */
  protected createFromForm(): ConfigurationSetting {
    return {
      ...new ConfigurationSetting(),
      id: this.editForm.get(["id"])!.value,
      key: this.editForm.get(["key"])!.value,
      value: this.editForm.get(["value"])!.value,
      name: this.editForm.get(["name"])!.value,
      group_name: this.editForm.get(["group_name"])!.value,
      value_type: this.editForm.get(["value_type"])!.value,
      value_options: this.editForm.get(["value_options"])!.value,
      value_option_query: this.editForm.get(["value_option_query"])!.value,
    };
  }
}
