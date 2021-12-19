import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from '../../core/auth.service';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MenuItem } from 'primeng/api';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { DialogService } from 'primeng/dynamicdialog';
import {ForceChangePasswordComponent} from "../force-change-password/force-change-password.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  gtMd!: Observable<boolean>;
  isGtMd = true;
  showData = false;
  user: any = this.localStorage.retrieve('user');
  avator: string = 'U';
  currentUserMenuItems: MenuItem[] = [];
  loading$ = this.router.events.pipe(
    filter(
      (event) =>
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError ||
        event instanceof NavigationStart
    ),
    map((event) => (event instanceof NavigationStart ? true : false))
  );

  constructor(
    private breakPointObserver: BreakpointObserver,
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.gtMd = this.breakPointObserver
      .observe('(max-width: 959px)')
      .pipe(map((result) => !result.matches));
    this.gtMd.subscribe((value) => {
      this.isGtMd = value;
    });
    if (this.user) {
      this.currentUserMenuItems = this.user.menus;
      this.avator = this.user.first_name.charAt(0).toUpperCase();
      this.userMenus.unshift({
        label: `${this.user.first_name} ${this.user.last_name}`,
        icon: 'pi pi-fw pi-user',
      });
    }
  }

  ngOnDestroy(): void {
    this.localStorage.clear('planrep-admin_cost_centre_state');
    this.localStorage.clear('planrep-planrep-admin_cost_centre_selected');
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    document.getElementById('flash-page')?.remove();
    console.log(this.user)
    if(this.user.forceChangePassword){
    //  this.forceChangePassword(); to be reviewed
    }
  }

  userMenus: MenuItem[] = [
    {
      label: 'Change password',
      icon: 'pi pi-fw pi-lock',
      command: ($event) => this.changePassword(),
    },
    {
      label: 'Logout',
      icon: 'pi pi-fw pi-power-off',
      command: ($event) => this.logout(),
    },
  ];

  items: MenuItem[] = [
    {
      label: 'Expenditure Centres',
      icon: 'pi pi-fw pi-arrow-right',
      routerLink: 'expenditure-centre',
    },
    {
      label: 'Expenditure Centre Items',
      icon: 'pi pi-fw pi-arrow-right',
      routerLink: 'expenditure-centre-item',
    },
    /**====Planrep setup Menu Generator Hook: Dont Delete====*/
  ];

  logout(): void {
    this.authService.logout().subscribe(() => {});
    this.localStorage.clear();
  }

  private loadMenu() {
    this.authService
      .currentUserMenu()
      .subscribe((resp: MenuItem[]) => (this.currentUserMenuItems = resp));
  }

  private changePassword() {
    this.dialogService.open(ChangePasswordComponent, {
      width: '40%',
      header: 'Personal Password Change Form',
    });
  }

  private forceChangePassword() {
    const ref = this.dialogService.open(ForceChangePasswordComponent, {
      width:"650px",
      closable:false,
      modal:true,
      header: "Change Password",
    });
  }

}
