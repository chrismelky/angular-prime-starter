import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../../../../shared/toast.service";
import {CustomResponse} from "../../../../utils/custom-response";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {GroupService} from "../../../group/group.service";
import {User} from "../../user.model";
import {UserGroupService} from "../user-group.service";
import {Group} from "../../../group/group.model";
import {CreateUserGroup} from "../user-group.model";

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
  groups?: Group[] = [];
  /**
   * Declare form
   */
  editForm = this.fb.group({
    groups: [null, [Validators.required]],
    expire_date: ['', [Validators.required]],
  });

  constructor(
    protected userGroupService: UserGroupService,
    protected groupService: GroupService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
  ) {
    this.user = dialogConfig.data.user;
  }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups() {
    this.groupService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<Group[]>) => (this.groups = resp.data)
      );
  }

  /**
   * When form is valid Create UserGroup or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    this.isSaving = true;
    const data = this.createFromForm();
    data.user_id = this.user?.id;
    this.subscribeToSaveResponse(this.userGroupService.assignMultipleGroups(data));
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
  protected createFromForm(): CreateUserGroup {
    return {
      ...new CreateUserGroup(),
      groups: this.editForm.get(["groups"])!.value,
      expire_date: this.editForm.get(["expire_date"])!.value,
    };
  }
}
