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

import { CustomResponse } from "../../../../utils/custom-response";
import { Role } from "src/app/setup/role/role.model";
import { RoleService } from "src/app/setup/role/role.service";
import { Permission } from "src/app/setup/permission/permission.model";
import { PermissionService } from "src/app/setup/permission/permission.service";
import { RolePermission } from "../role-permission.model";
import { RolePermissionService } from "../role-permission.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-role-permission-update",
  templateUrl: "./role-permission-update.component.html",
})
export class RolePermissionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  role: Role;
  roles?: Role[] = [];
  permissions?: Permission[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    permission_id: [null, [Validators.required]],
  });

  constructor(
    protected rolePermissionService: RolePermissionService,
    protected permissionService: PermissionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.role = this.dialogConfig.data.role;
  }

  ngOnInit(): void {
    this.permissionService
      .query({ columns: ["id", "name","description"] })
      .subscribe(
        (resp: CustomResponse<Permission[]>) => (this.permissions = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create RolePermission or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    this.isSaving = true;
    const rolePermission = this.createFromForm();
    rolePermission.role_id = this.role.id;
    if (rolePermission.id !== undefined) {
      this.subscribeToSaveResponse(
        this.rolePermissionService.update(rolePermission)
      );
    } else {
      this.subscribeToSaveResponse(
        this.rolePermissionService.create(rolePermission)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<RolePermission>>
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
   * @param rolePermission
   */
  protected updateForm(rolePermission: RolePermission): void {
    this.editForm.patchValue({
      id: rolePermission.id,
      permission_id: rolePermission.permission_id,
    });
  }

  /**
   * Return form values as object of type RolePermission
   * @returns RolePermission
   */
  protected createFromForm(): RolePermission {
    return {
      ...new RolePermission(),
      id: this.editForm.get(["id"])!.value,
      permission_id: this.editForm.get(["permission_id"])!.value,
    };
  }
}
