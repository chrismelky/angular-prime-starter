import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {UserGroupService} from "../user-group.service";
import {Group} from "../../group.model";
import {User} from "../../../user/user.model";
import {UserService} from "../../../user/user.service";
import {HelperService} from "../../../../utils/helper.service";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../../utils/custom-response";
import {finalize} from "rxjs/operators";
import {CreateUserGroup} from "../user-group.model";
import {ToastService} from "../../../../shared/toast.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  group!: Group;
  users?: User[] = [];
  userControl = new FormControl(null, [Validators.required]);
  expireDateControl = new FormControl(null, [Validators.required]);
  isLoading = false;
  search: any = {};

  constructor(
    protected userGroupService: UserGroupService,
    protected userService: UserService,
    public dialogRef: DynamicDialogRef,
    public toastService: ToastService,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    protected helper: HelperService,
  ) {
    this.group = dialogConfig.data.group;
  }

  ngOnInit(): void {

  }

  save(): void {
    this.isLoading = true;
    const users = this.userControl.value;
    const userIds: number[] = [];
    users.map((row: { id: number; }) => {
      userIds.push(row.id);
    });
    const payload = {
      group_id: this.group?.id,
      users: userIds,
      expire_date: this.expireDateControl.value
    } as CreateUserGroup;
    this.subscribeToSaveResponse(this.userGroupService.assignMultipleUsers(payload));
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
    this.isLoading = false;
  }

  searchUser(event: any) {
    const query = {
      first_name: event.query,
      last_name: event.query,
      mobile_number: event.query,
      check_number: event.query,
    } as User;
    this.userService.query({
      page: 1,
      per_page: 5,
      ...this.helper.buildFilter(query),
    }).subscribe(response => {
      this.users = response.data;
    });
  }
}
