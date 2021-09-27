import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../../../../shared/toast.service";
import {CustomResponse} from "../../../../utils/custom-response";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {PermissionService} from "../../../permission/permission.service";
import {Permission} from "../../../permission/permission.model";
import {Menu} from "../../menu.model";
import {MenuPermissionService} from "../menu-permission.service";
import {CreateMenuPermission} from "../menu-permission.model";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  menu: Menu | undefined;
  permissions?: Permission[] = [];
  /**
   * Declare form
   */
  editForm = this.fb.group({
    permissions: [null, [Validators.required]],
  });

  constructor(
    protected menuPermissionService: MenuPermissionService,
    protected permissionService: PermissionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
  ) {
    this.menu = dialogConfig.data.menu;
  }

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions() {
    this.permissionService
      .query({columns: ["id", "name","description"]})
      .subscribe(
        (resp: CustomResponse<Permission[]>) => (this.permissions = resp.data)
      );
  }

  /**
   * When form is valid Create RolePermission or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    this.isSaving = true;
    const data = this.createFromForm();
    data.menu_id = this.menu?.id;
    this.subscribeToSaveResponse(this.menuPermissionService.assignMultiplePermissions(data));
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
   * Return form values as object of type RolePermission
   * @returns RolePermission
   */
  protected createFromForm(): CreateMenuPermission {
    return {
      ...new CreateMenuPermission(),
      permissions: this.editForm.get(["permissions"])!.value,
    };
  }
}
