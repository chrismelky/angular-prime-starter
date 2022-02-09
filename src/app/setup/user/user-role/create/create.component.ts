/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../../shared/toast.service';
import { CustomResponse } from '../../../../utils/custom-response';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RoleService } from '../../../role/role.service';
import { Role } from '../../../role/role.model';
import { UserRoleService } from '../user-role.service';
import { User } from '../../user.model';
import { CreateUserRole } from '../user-role.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  user: User | undefined;
  roles?: Role[] = [];
  /**
   * Declare form
   */
  editForm = this.fb.group({
    roles: [null, [Validators.required]],
  });

  admin_hierarchy_position: number | undefined;

  constructor(
    protected userRoleService: UserRoleService,
    protected roleService: RoleService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.user = dialogConfig.data.user;
  }

  ngOnInit(): void {}

  /**
   * When form is valid Create UserRole or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    this.isSaving = true;
    const data = this.createFromForm();
    let roles = [];
    const roleId = this.editForm.get('roles')?.value as number;
    const role = {
      id: roleId,
    } as Role;
    roles.push(role);
    data.roles = roles;
    data.user_id = this.user?.id;
    this.subscribeToSaveResponse(
      this.userRoleService.assignMultipleRoles(data)
    );
  }

  /**
   *
   * @param result
   * @protected
   */
  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<null>>
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
   * Return form values as object of type UserRole
   * @returns UserRole
   */
  protected createFromForm(): CreateUserRole {
    return {
      ...new CreateUserRole(),
      roles: this.editForm.get(['roles'])!.value,
    };
  }
}
