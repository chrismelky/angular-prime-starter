/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {CustomResponse} from "../../../utils/custom-response";
import {HelperService} from "src/app/utils/helper.service";
import {ToastService} from "src/app/shared/toast.service";
import {Role} from "src/app/setup/role/role.model";
import {AllPermissionAndAssigned, Permission} from "src/app/setup/permission/permission.model";
import {RolePermissionService} from "./role-permission.service";
import {RoleService} from "../role.service";
import {CreateRolePermission, RolePermission} from "./role-permission.model";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";

@Component({
  selector: "app-role-permission",
  templateUrl: "./role-permission.component.html",
})
export class RolePermissionComponent implements OnInit {
  isLoading = false;
  role!: Role;
  assignedPerms?: Permission[] = [];
  permissions?: Permission[] = [];
  isSaving = false;

  constructor(
    protected rolePermissionService: RolePermissionService,
    protected roleService: RoleService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService
  ) {
    this.role = this.dialogConfig.data.role;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.roleService
      .allPermissionsAndAssignedPermissions(this.role.id)
      .subscribe(
        (resp: CustomResponse<AllPermissionAndAssigned>) => {
          this.processData(resp);
        }
      );
  }

  private processData(resp: CustomResponse<AllPermissionAndAssigned>) {
    this.permissions = resp.data?.all;
    this.assignedPerms = resp.data?.assigned;
  }

  addOnePermissions(event: any) {
    const items = event.items as Permission[];
    let perms: (number | undefined)[] = [];
    items.map(row => {
      perms.push(row.id);
    })
    const payload = {
      permissions: perms,
      role_id: this.role.id
    } as CreateRolePermission;
    this.subscribeToSaveResponse(this.rolePermissionService.assignMultiplePermissions(payload));
  }

  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected subscribeToSaveResponse(result: Observable<CustomResponse<null>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  addAllPermissions(event: any) {
    this.rolePermissionService
      .addAllPermissions(this.role.id)
      .subscribe((resp) => {
        this.loadData();
        this.toastService.info(resp.message);
      });
  }

  removeOnePermission(event: any) {
    const items = event.items;
    const permission = items[0];
    this.rolePermissionService
      .deleteByRoleAndPermission(this.role.id, permission.id)
      .subscribe((resp) => {
        this.loadData();
        this.toastService.info(resp.message);
      });
  }

  removeAllPermissions(event: any) {
    this.rolePermissionService
      .deleteAllPermissions(this.role.id)
      .subscribe((resp) => {
        this.loadData();
        this.toastService.info(resp.message);
      });
  }
}
