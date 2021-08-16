import { Component, OnInit } from '@angular/core';

import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NavigationItem } from '../menu-item/nav.item';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  gtMd!: Observable<boolean>;
  isGtMd = true;

  constructor(private breakPointObsever: BreakpointObserver) {
    this.gtMd = this.breakPointObsever
      .observe('(max-width: 959px)')
      .pipe(map((result) => !result.matches));
    this.gtMd.subscribe((value) => {
      this.isGtMd = value;
    });
  }

  ngOnInit(): void {}

  items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-pw pi-chart-bar',
      routerLink: 'dashboard',
    },
    {
      label: 'Setup',
      icon: 'pi pi-pw pi-cog',
      separator: true,
      items: [
        {
          label: 'Facility Managment',
          icon: 'pi pi-fw pi-chevron-circle-right',
          items: [
            {
              label: 'Facility Types',
              icon: 'pi pi-fw pi-angle-right',
              routerLink: 'facility-type',
            },
            {
              label: 'Facilities',
              icon: 'pi pi-fw pi-angle-right',
              routerLink: 'facility',
            },
          ],
        },
        {
          label: 'Admin Hierarchy Managment',
          icon: 'pi pi-fw pi-chevron-circle-right',
          items: [
            {
              label: 'Facility Types',
              icon: 'pi pi-fw',
              routerLink: 'facility-type',
            },
          ],
        },
      ],
    },
    {
      label: 'Planning',
      icon: 'pi pi-pw pi-list',
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw',
        },
      ],
    },
    {
      label: 'Budgeting',
      icon: 'pi pi-pw pi-money-bill',
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw',
        },
      ],
    },
  ];
  navlinks: NavigationItem[] = [
    {
      title: 'Dashboard',
      subTitle: 'Application dashboard',
      iconName: 'dashboard',
      authorities: ['VIEW_DASHBOARD'],
      route: '/dashboard',
    },
    {
      title: 'System Settings',
      subTitle: 'Settings',
      iconName: 'settings',
      route: '/system-settings',
      authorities: ['ROLE_ADMIN'],
      children: [
        {
          title: 'Financial Years',
          iconName: 'keyboard_arrow_right',
          route: '/user',
          children: [
            {
              title: 'Financial Years',
              iconName: 'keyboard_arrow_right',
              route: '/user',
            },
            {
              title: 'Quarters',
              iconName: 'keyboard_arrow_right',
              route: '/user',
            },
          ],
        },
        {
          title: 'Administative Hierarchy',
          iconName: 'keyboard_arrow_right',
          route: '/financial-year',
        },
      ],
    },
    {
      title: 'Planning',
      subTitle: 'Settings',
      iconName: 'settings',
      route: '/system-settings',
      authorities: ['ROLE_ADMIN'],
      children: [
        {
          title: 'Users',
          iconName: 'keyboard_arrow_right',
          route: '/user',
        },
        {
          title: 'Financial Years',
          iconName: 'keyboard_arrow_right',
          route: '/financial-year',
        },
      ],
    },
  ];
}
