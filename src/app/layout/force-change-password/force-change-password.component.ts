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
  selector: 'app-force-change-password.component',
  templateUrl: './force-change-password.component.html',
  styleUrls: ['./force-change-password.component.scss']
})

export class ForceChangePasswordComponent implements OnInit {
  loading: boolean;
  formGroup = this.formBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40),Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}:;<>,.?\~_+-=\|]).{6,15}$/)]],
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
    console.log("HHHh")
   // this.formGroup = this.initFormGroup();
  }

  reset(): void {
    this.loading = true;
    const data = this.createFromForm();
    console.log("LLLLLLLLLLL")
    console.log(data)
    /*
    const data = this.createFromForm();
    data.id = this.user?.id;
    this.subscribeToSaveResponse(this.userService.changePassword(data));
    *
     */
  }


  protected createFromForm() {
    return {
      password: this.formGroup.get(["password"])!.value,
      passwordConfirmation: this.formGroup.get(["passwordConfirmation"])!.value,
    };
  }
}
