import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../core/auth.service';
import { StateStorageService } from '../core/state-storage.service';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('email', { static: false })
  email?: ElementRef;

  formError = false;
  isLoading = false;
  authenticationError = false;

  /**
   * Declare form
   */
  loginForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private stateStorage: StateStorageService,
    private router: Router,
    private toastService: ToastService,
    protected messageService: MessageService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.email) {
      this.email.nativeElement.focus();
    }
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.formError = true;
      return;
    }
    this.isLoading = true;
    this.formError = false;
    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe(
      () => {
        this.authenticationError = false;
        this.isLoading = false;
        if (!this.stateStorage.getUrl()) {
          // There were no routing during login (eg from navigationToStoredUrl)
          this.router.navigate(['']);
        } else {
          this.router.navigate([this.stateStorage.getUrl()]);
        }
      },
      (error: HttpErrorResponse) => {
        this.authenticationError = true;
        this.isLoading = false;
        console.log(error.error.message);
        if (error.status === 401) {
          this.toastService.error('Invalid Login');
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error' });
        }
      }
    );
  }
}
