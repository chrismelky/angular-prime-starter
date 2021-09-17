/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

import {CustomResponse} from "../../../../utils/custom-response";
import {Group} from "src/app/setup/group/group.model";
import {Role} from "src/app/setup/role/role.model";
import {RoleService} from "src/app/setup/role/role.service";
import {GroupRole} from "../group-role.model";
import {GroupRoleService} from "../group-role.service";
import {ToastService} from "src/app/shared/toast.service";

@Component({
  selector: "app-group-role-update",
  templateUrl: "./group-role-update.component.html",
})
export class GroupRoleUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  roles?: Role[] = [];
  group: Group | undefined;

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    role_id: [null, [Validators.required]],
  });

  constructor(
    protected groupRoleService: GroupRoleService,
    protected roleService: RoleService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.group = this.dialogConfig.data.group;
  }

  ngOnInit(): void {
    this.roleService
      .query({columns: ["id", "name"]})
      .subscribe((resp: CustomResponse<Role[]>) => (this.roles = resp.data));
    this.updateForm(this.dialogConfig.data.groupRole); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create GroupRole or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const groupRole = this.createFromForm();
    groupRole.group_id = this.group?.id
    if (groupRole.id !== undefined) {
      this.subscribeToSaveResponse(this.groupRoleService.update(groupRole));
    } else {
      this.subscribeToSaveResponse(this.groupRoleService.create(groupRole));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<GroupRole>>
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
  protected onSaveError(error: any): void {
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param groupRole
   */
  protected updateForm(groupRole: GroupRole): void {
    this.editForm.patchValue({
      id: groupRole.id,
      role_id: groupRole.role_id,
    });
  }

  /**
   * Return form values as object of type GroupRole
   * @returns GroupRole
   */
  protected createFromForm(): GroupRole {
    return {
      ...new GroupRole(),
      id: this.editForm.get(["id"])!.value,
      role_id: this.editForm.get(["role_id"])!.value,
    };
  }
}
