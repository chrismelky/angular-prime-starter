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

import { CustomResponse } from '../../../../utils/custom-response';
import { Role } from 'src/app/setup/role/role.model';
import { RoleService } from 'src/app/setup/role/role.service';
import { User } from 'src/app/setup/user/user.model';
import { UserService } from 'src/app/setup/user/user.service';
import { UserRole } from '../user-role.model';
import { UserRoleService } from '../user-role.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-user-role-update',
  templateUrl: './user-role-update.component.html',
})
export class UserRoleUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  roles?: Role[] = [];
  users?: User[] = [];
  user: User | undefined;
  userRole: UserRole;

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    role_id: [null, [Validators.required]],
  });

  constructor(
    protected userRoleService: UserRoleService,
    protected roleService: RoleService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.user = dialogConfig.data.user;
    this.userRole = dialogConfig.data.userRole;
  }

  ngOnInit(): void {
    this.roleService
      .query({ columns: ['id', 'name'] })
      .subscribe((resp: CustomResponse<Role[]>) => (this.roles = resp.data));
    this.updateForm(this.dialogConfig.data.userRole);
  }

  /**
   * When form is valid Create UserRole or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const userRole = this.createFromForm();
    userRole.user_id = this.user?.id;
    console.log(this.user);
    if (userRole.id !== undefined) {
      this.subscribeToSaveResponse(this.userRoleService.update(userRole));
    } else {
      this.subscribeToSaveResponse(this.userRoleService.create(userRole));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<UserRole>>
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
   * @param userRole
   */
  protected updateForm(userRole: UserRole): void {
    this.editForm.patchValue({
      id: userRole.id,
      role_id: userRole.role_id,
    });
  }

  /**
   * Return form values as object of type UserRole
   * @returns UserRole
   */
  protected createFromForm(): UserRole {
    return {
      ...new UserRole(),
      id: this.editForm.get(['id'])!.value,
      role_id: this.editForm.get(['role_id'])!.value,
    };
  }
}
