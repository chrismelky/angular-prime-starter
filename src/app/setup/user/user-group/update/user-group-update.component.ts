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
import {User} from "src/app/setup/user/user.model";
import {UserService} from "src/app/setup/user/user.service";
import {Group} from "src/app/setup/group/group.model";
import {GroupService} from "src/app/setup/group/group.service";
import {UserGroup} from "../user-group.model";
import {UserGroupService} from "../user-group.service";
import {ToastService} from "src/app/shared/toast.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: "app-user-group-update",
  templateUrl: "./user-group-update.component.html",
})
export class UserGroupUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  groups?: Group[] = [];
  user: User | undefined;
  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    group_id: [null, [Validators.required]],
    expire_date: [null, [Validators.required]],
  });

  constructor(
    protected userGroupService: UserGroupService,
    protected userService: UserService,
    protected groupService: GroupService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.user = dialogConfig.data.user;
  }

  ngOnInit(): void {
    this.groupService
      .query({columns: ["id", "name"]})
      .subscribe((resp: CustomResponse<Group[]>) => (this.groups = resp.data));
    this.updateForm(this.dialogConfig.data.userGroup); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create UserGroup or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const userGroup = this.createFromForm();
    userGroup.user_id = this.user?.id;
    if (userGroup.id !== undefined) {
      this.subscribeToSaveResponse(this.userGroupService.update(userGroup));
    } else {
      this.subscribeToSaveResponse(this.userGroupService.create(userGroup));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<UserGroup>>
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
   * @param userGroup
   */
  protected updateForm(userGroup: UserGroup): void {
    this.editForm.patchValue({
      id: userGroup.id,
      group_id: userGroup.group_id,
      expire_date:
        userGroup.expire_date !== undefined
          ? new Date(userGroup.expire_date!)
          : userGroup.expire_date,
    });
  }

  /**
   * Return form values as object of type UserGroup
   * @returns UserGroup
   */
  protected createFromForm(): UserGroup {
    return {
      ...new UserGroup(),
      id: this.editForm.get(["id"])!.value,
      group_id: this.editForm.get(["group_id"])!.value,
      expire_date: this.editForm.get(["expire_date"])!.value,
    };
  }
}
