import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef, Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { StateStorageService } from '../core/state-storage.service';
import { Location,LocationStrategy,DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formError = false;
  isLoading = false;
  authenticationError = false;
  url: string = '';

  /**
   * Declare form
   */
  loginForm = this.fb.group({
    email: [null, [Validators.required]],
    password: [null, [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private stateStorage: StateStorageService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.url = this.document.location.href;
    console.log('Injected document.location', this.url)
    document.getElementById('flash-page')?.remove();
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.formError = true;
      return;
    }
    this.isLoading = true;
    this.formError = false;
    this.authenticationError = false;
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
        this.isLoading = false;
        if (error.status === 401) {
          this.authenticationError = true;
        }
      }
    );
  }
}
