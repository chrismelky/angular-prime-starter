import {Component, OnInit} from '@angular/core';
import {AdminHierarchy} from "../../admin-hierarchy/admin-hierarchy.model";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../../../shared/toast.service";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custom-response";
import {finalize} from "rxjs/operators";
import {User} from "../user.model";
import {UserService} from "../user.service";

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  adminHierarchy!: AdminHierarchy;
  user!: User;
  isSaving = false;

  constructor(public dialogRef: DynamicDialogRef,
              public toastService: ToastService,
              public userService: UserService,
              public dialogConfig: DynamicDialogConfig) {
    this.user = this.dialogConfig.data.user as User;
  }

  ngOnInit(): void {
  }

  save(): void {
    const user = this.user;
    user.admin_hierarchy_id = this.adminHierarchy.id;
    this.subscribeToSaveResponse(this.userService.update(user));
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<User>>
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
    this.toastService.info('User Transferred Successfully!');
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

  onAdminHierarchySelection(adminHierarchy: AdminHierarchy): void {
    this.adminHierarchy = adminHierarchy;
  }
}
