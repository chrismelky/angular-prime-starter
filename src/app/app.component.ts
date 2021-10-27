import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LoaderService } from './shared/loader-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private loaderService: LoaderService,
    private permissionsService: NgxPermissionsService,
    private $localStorage: LocalStorageService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = false;
    const user = this.$localStorage.retrieve('user');
    this.permissionsService.loadPermissions(user.permissions);
  }

  ngAfterViewInit() {
    this.loaderService.httpProgress().subscribe((status: boolean) => {
      if (status) {
        this.renderer.addClass(document.body, 'cursor-loader');
      } else {
        this.renderer.removeClass(document.body, 'cursor-loader');
      }
    });
  }
}
