import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {User} from "../user.model";
import {ToastService} from "../../../shared/toast.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import Validation, {PasswordReset} from "./password-reset";
import {finalize} from "rxjs/operators";
import {CreateUserRole} from "../user-role/user-role.model";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custom-response";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  loading: boolean;
  user: User;

  formGroup = this.formBuilder.group(
    {
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
    private formBuilder: FormBuilder,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
  ) {
    this.loading = false;
    this.user = this.dialogConfig.data.user;
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
  }

  initFormGroup(): FormGroup {
    return this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
        passwordConfirmation: ['', Validators.required]
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
    this.subscribeToSaveResponse(this.userService.passwordReset(data));
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
    };
  }
}
