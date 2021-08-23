import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { StateStorageService } from '../core/state-storage.service';

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
    private router: Router
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
    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe(
      () => {
        this.authenticationError = false;
        if (!this.stateStorage.getUrl()) {
          // There were no routing during login (eg from navigationToStoredUrl)
          this.router.navigate(['']);
        } else {
          this.router.navigate([this.stateStorage.getUrl()]);
        }
      },
      () => (this.authenticationError = true)
    );
  }
}
