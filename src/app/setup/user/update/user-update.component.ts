/**  * @license */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CustomResponse } from '../../../utils/custom-response';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { ToastService } from 'src/app/shared/toast.service';
import { Role } from '../../role/role.model';
import { RoleService } from '../../role/role.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
})
export class UserUpdateComponent implements OnInit {
  isSaving = false;
  facilityIsLoading = false;
  roleIsLoading = false;
  sectionIsLoading = false;

  formError = false;
  errors = [];
  roles?: Role[] = [];
  facilities?: any[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    first_name: [null, [Validators.required]],
    last_name: [null, [Validators.required]],
    username: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    cheque_number: [null, [Validators.required]],
    active: [false, []],
    title: [null, []],
    mobile_number: [null, []],
    role_id: [null, []],
    is_super_user: [false, []],
  });

  constructor(
    protected userService: UserService,
    protected roleService: RoleService,
    protected fb: FormBuilder,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const dialogData = this.dialogConfig.data;

    const user: User = dialogData.user;

    this.loadRoleByAdminLevel(
      dialogData.adminHierarchy.admin_hierarchy_position
    );

    this.updateForm(user);
  }

  /**
   * When form is valid Create User Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const user = this.createFromForm();
    if (user.id === undefined) {
      this.subscribeToSaveResponse(this.userService.create(user));
    } else {
      this.subscribeToSaveResponse(this.userService.update(user));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<User>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  close() {
    this.dialogRef.close();
  }

  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(result);
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
   * @param user
   */
  protected updateForm(user: User): void {
    this.editForm.patchValue({
      id: user?.id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      cheque_number: user?.cheque_number,
      active: user?.active,
      title: user?.title,
      mobile_number: user?.mobile_number,
      username: user?.username,
      role_id: user?.roles?.length ? user?.roles[0].id : null,
      is_super_user: user?.is_super_user,
    });
  }

  /**
   * Return form values as object of type User
   * @returns User
   */
  protected createFromForm(): User {
    return {
      ...new User(),
      ...this.editForm.value,
      roles: [{ id: this.editForm.get('role_id')?.value }],
    };
  }

  loadRoleByAdminLevel(adminHierarchyPosition: number): void {
    this.roleIsLoading = true;
    this.roleService
      .query({
        columns: ['id', 'name'],
        admin_hierarchy_position: adminHierarchyPosition,
      })
      .subscribe(
        (resp: CustomResponse<Role[]>) => {
          this.roles = resp.data;
          this.roleIsLoading = false;
        },
        (error) => (this.roleIsLoading = false)
      );
  }
}
