import { Component, OnInit } from '@angular/core';
import {User} from "../../setup/user/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Validation, {PasswordReset} from "../../setup/user/password-reset/password-reset";
import {UserService} from "../../setup/user/user.service";
import {ToastService} from "../../shared/toast.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Observable} from "rxjs";
import {CustomResponse} from "../../utils/custom-response";
import {finalize} from "rxjs/operators";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  loading: boolean;
  user: any = this.localStorage.retrieve("user");

  formGroup = this.formBuilder.group(
    {
      oldPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      passwordConfirmation: ['', Validators.required]
    },
    {
      validators: [Validation.match('password', 'passwordConfirmation')]
    }
  );

  constructor(
    private userService: UserService,
    private toast: ToastService,
    private localStorage: LocalStorageService,
    private formBuilder: FormBuilder,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
  }

  initFormGroup(): FormGroup {
    return this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
        passwordConfirmation: ['', Validators.required],
        oldPassword: ['', Validators.required],
      },
      {
        validators: [Validation.match('password', 'passwordConfirmation')]
      }
    );
  }

  reset(): void {
    this.loading = true;
    const data = this.createFromForm();
    data.id = this.user?.id;
    this.subscribeToSaveResponse(this.userService.changePassword(data));
  }

  protected subscribeToSaveResponse(result: Observable<CustomResponse<User>>): void {
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
    this.toast.info(result.message);
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
    this.loading = false;
  }

  close():void {
    this.dialogRef.close();
  }

  protected createFromForm(): PasswordReset {
    return {
      ...new PasswordReset(),
      password: this.formGroup.get(["password"])!.value,
      passwordConfirmation: this.formGroup.get(["passwordConfirmation"])!.value,
      oldPassword: this.formGroup.get(["oldPassword"])!.value,
    };
  }
}
