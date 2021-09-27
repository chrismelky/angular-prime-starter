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
import { Menu } from "src/app/setup/menu/menu.model";
import { MenuService } from "src/app/setup/menu/menu.service";
import { Permission } from "src/app/setup/permission/permission.model";
import { PermissionService } from "src/app/setup/permission/permission.service";
import { MenuPermission } from "../menu-permission.model";
import { MenuPermissionService } from "../menu-permission.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-menu-permission-update",
  templateUrl: "./menu-permission-update.component.html",
})
export class MenuPermissionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  permissions?: Permission[] = [];
  menu: Menu | undefined;

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    permission_id: [null, [Validators.required]],
  });

  constructor(
    protected menuPermissionService: MenuPermissionService,
    protected menuService: MenuService,
    protected permissionService: PermissionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.menu = dialogConfig.data.menu;
  }

  ngOnInit(): void {
    this.permissionService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Permission[]>) => (this.permissions = resp.data)
      );
    this.updateForm(this.dialogConfig.data);
  }

  /**
   * When form is valid Create MenuPermission or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const menuPermission = this.createFromForm();
    menuPermission.menu_id = this.menu?.id
    if (menuPermission.id !== undefined) {
      this.subscribeToSaveResponse(
        this.menuPermissionService.update(menuPermission)
      );
    } else {
      this.subscribeToSaveResponse(
        this.menuPermissionService.create(menuPermission)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<MenuPermission>>
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
   * @param menuPermission
   */
  protected updateForm(menuPermission: MenuPermission): void {
    this.editForm.patchValue({
      id: menuPermission.id,
      permission_id: menuPermission.permission_id,
    });
  }

  /**
   * Return form values as object of type MenuPermission
   * @returns MenuPermission
   */
  protected createFromForm(): MenuPermission {
    return {
      ...new MenuPermission(),
      id: this.editForm.get(["id"])!.value,
      permission_id: this.editForm.get(["permission_id"])!.value,
    };
  }
}
