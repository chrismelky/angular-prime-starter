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
import { Role } from '../role.model';
import { RoleService } from '../role.service';
import { ToastService } from 'src/app/shared/toast.service';
import { AdminHierarchyLevel } from '../../admin-hierarchy-level/admin-hierarchy-level.model';
import { AdminHierarchyLevelService } from '../../admin-hierarchy-level/admin-hierarchy-level.service';

@Component({
  selector: 'app-role-update',
  templateUrl: './role-update.component.html',
})
export class RoleUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  adminHierarchyLevels?: AdminHierarchyLevel[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    admin_hierarchy_position: [null, [Validators.required]],
  });

  constructor(
    protected roleService: RoleService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService
  ) {}

  ngOnInit(): void {
    this.adminHierarchyLevelService
      .query()
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>
          (this.adminHierarchyLevels = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create Role or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const role = this.createFromForm();
    if (role.id !== undefined) {
      this.subscribeToSaveResponse(this.roleService.update(role));
    } else {
      this.subscribeToSaveResponse(this.roleService.create(role));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Role>>
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
   * @param role
   */
  protected updateForm(role: Role): void {
    this.editForm.patchValue({
      id: role.id,
      name: role.name,
      admin_hierarchy_position: role.admin_hierarchy_position,
    });
  }

  /**
   * Return form values as object of type Role
   * @returns Role
   */
  protected createFromForm(): Role {
    return {
      ...new Role(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      admin_hierarchy_position: this.editForm.get(['admin_hierarchy_position'])!
        .value,
    };
  }
}
