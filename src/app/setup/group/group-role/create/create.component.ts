import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../../../../shared/toast.service";
import {CustomResponse} from "../../../../utils/custom-response";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {Group} from "../../group.model";
import {Role} from "../../../role/role.model";
import {RoleService} from "../../../role/role.service";
import {GroupRoleService} from "../group-role.service";
import {CreateGroupRole} from "../group-role.model";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  group: Group | undefined;
  roles?: Role[] = [];
  /**
   * Declare form
   */
  editForm = this.fb.group({
    roles: [null, [Validators.required]],
  });

  constructor(
    protected groupRoleService: GroupRoleService,
    protected roleService: RoleService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
  ) {
    this.group = dialogConfig.data.group;
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<Group[]>) => (this.roles = resp.data)
      );
  }

  /**
   * When form is valid Create UserGroup or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    this.isSaving = true;
    const data = this.createFromForm();
    data.group_id = this.group?.id;
    this.subscribeToSaveResponse(this.groupRoleService.assignMultipleRoles(data));
  }

  /**
   *
   * @param result
   * @protected
   */
  protected subscribeToSaveResponse(result: Observable<CustomResponse<null>>): void {
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
   * Return form values as object of type UserGroup
   * @returns UserGroup
   */
  protected createFromForm(): CreateGroupRole {
    return {
      ...new CreateGroupRole(),
      roles: this.editForm.get(["roles"])!.value,
    };
  }
}
