import { Component, OnInit } from "@angular/core";

import { BreakpointObserver } from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { MenuItem } from "primeng/api";
import { LocalStorageService } from "ngx-webstorage";
import { AuthService } from "src/app/core/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  gtMd!: Observable<boolean>;
  isGtMd = true;
  user: any = this.localStorage.retrieve("user");
  avator: string = "U";

  constructor(
    private breakPointObsever: BreakpointObserver,
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.gtMd = this.breakPointObsever
      .observe("(max-width: 959px)")
      .pipe(map((result) => !result.matches));
    this.gtMd.subscribe((value) => {
      this.isGtMd = value;
    });
    if (this.user) {
      this.avator = this.user.first_name.charAt(0).toUpperCase();
      this.userMenus.unshift({
        label: `${this.user.first_name} ${this.user.last_name}`,
        icon: "pi pi-fw pi-user",
      });
    }
  }

  ngOnInit(): void {
    console.log(this.user);
  }

  userMenus: MenuItem[] = [
    { label: "Change password", icon: "pi pi-fw pi-lock" },
    {
      label: "Logout",
      icon: "pi pi-fw pi-power-off",
      command: ($event) => this.logout(),
    },
  ];

  items: MenuItem[] = [
    {
      label: "Dashboard",
      icon: "pi pi-pw pi-chart-bar",
      routerLink: "dashboard",
    },
    {
      label: "Setup",
      icon: "pi pi-pw pi-cog",
      separator: true,
      items: [
        {
          label: "Asset Uses",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "asset-use",
        },
        {
          label: "Bank Accounts",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "bank-account",
        },
        {
          label: "Asset Conditions",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "asset-condition",
        },
        {
          label: "Account Types",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "account-type",
        },
        {
          label: "Activity Types",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "activity-type",
        },
        {
          label: "Activity Task Natures",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "activity-task_nature",
        },
        {
          label: "Admin Hierarchy Levels",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "admin-hierarchy_level",
        },
        {
          label: "Admin Hierarchies",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "admin-hierarchy",
        },
        {
          label: "Sectors",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "sector",
        },
        {
          label: "Section Levels",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "section-level",
        },
        {
          label: "Sections",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "section",
        },
        {
          label: "Decision Levels",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "decision-level",
        },
        {
          label: "Reference Document Types",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "reference-document_type",
        },
        {
          label: "Reference Types",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "reference-type",
        },
        {
          label: "Financial Years",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "financial-year",
        },
        {
          label: "Decision Levels",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "decision-level",
        },
        {
          label: "Strategic Plans",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "strategic-plan",
        },
        {
          label: "Reference Types",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "reference-type",
        },
        {
          label: "Financial Years",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "financial-year",
        },
        {
          label: "Admin Hierarchy Levels",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "admin-hierarchy-level",
        },
        {
          label: "Reference Document Types",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "reference-document-type",
        },
        {
          label: "Cas Plans",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "cas-plan",
        },
        {
          label: "Cas Plan Contents",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "cas-plan-content",
        },
        {
          label: "Activity Task Natures",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "activity-task-nature",
        },
        {
          label: "Activity Task Natures",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "activity-task-nature",
        },
        {
          label: "Objective Types",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "objective-type",
        },
        {
          label: "Objectives",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "objective",
        },
        {
          label: "Long Term Targets",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "long-term-target",
        },
        {
          label: "Calendar Events",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "calendar-event",
        },
        {
          label: "Calendar Events",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "calendar-event",
        },
        {
          label: "Calendars",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "calendar",
        },
        {
          label: "Cas Assessment Rounds",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "cas-assessment-round",
        },
        {
          label: "Cas Assessment States",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "cas-assessment-state",
        },
        {
          label: "Cas Assessment Criteria",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "cas-assessment-criteria",
        },
        {
          label: "Cas Assessment Sub Criteria",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "cas-assessment-sub-criteria",
        },
        {
          label: "Cas Assessment Sub Criteria Options",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "cas-assessment-sub-criteria-option",
        },
        {
          label: "Cas Assessment Category Versions",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "cas-assessment-category-version",
        },
        {
          label: "Cas Assessment Criteria Options",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "cas-assessment-criteria-option",
        },
        {
          label: "Cas Assessment Categories",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "cas-assessment-category",
        },
        {
          label: "Reference Documents",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "reference-document",
        },
        {
          label: "Period Groups",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "period-group",
        },
        {
          label: "Data Sets",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "data-set",
        },
        {
          label: "Option Sets",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "option-set",
        },
        {
          label: "Category Options",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "category-option",
        },
        {
          label: "Category Combinations",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "category-combination",
        },
        {
          label: "Category Category Options",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "category-category-option",
        },
        {
          label: "Categories",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "category",
        },
        {
          label: "Calendars",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "calendar",
        },
        {
          label: "Category Category Combinations",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "category-category-combination",
        },
        {
          label: "Data Elements",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "data-element",
        },
        {
          label: "Facility Types",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "facility-type",
        },
        {
          label: "Facilities",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "facility",
        },
        {
          label: "Baseline Statistics",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "baseline-statistic",
        },
        {
          label: "Baseline Statistic Values",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "baseline-statistic-value",
        },
        {
          label: "Advertisements",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "advertisement",
        },
        /**====Planrep setup Menu Generator Hook: Dont Delete====*/
      ],
    },
    {
      label: "Planning",
      icon: "pi pi-pw pi-list",
      items: [
        /**====Planrep planning Menu Generator Hook: Dont Delete====*/
      ],
    },
    {
      label: "Budgeting",
      icon: "pi pi-pw pi-money-bill",
      items: [
        /**====Planrep budgeting Menu Generator Hook: Dont Delete====*/
      ],
    },
    {
      label: "Execution",
      icon: "pi pi-pw pi-money-bill",
      items: [
        /**====Planrep execution Menu Generator Hook: Dont Delete====*/
      ],
    },
  ];

  logout(): void {
    console.log("called");
    this.authService.logout().subscribe(() => {});
  }
}
