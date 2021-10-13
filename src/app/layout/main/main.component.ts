import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "ngx-webstorage";
import { AuthService } from "../../core/auth.service";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { BreakpointObserver } from "@angular/cdk/layout";
import { MenuItem } from "primeng/api";
import { filter, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { DialogService } from "primeng/dynamicdialog";

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
      .observe("(max-width: 959px)")
      .pipe(map((result) => !result.matches));
    this.gtMd.subscribe((value) => {
      this.isGtMd = value;
    });
    if (this.user) {
      this.currentUserMenuItems = this.user.menus;
      this.avator = this.user.first_name.charAt(0).toUpperCase();
      this.userMenus.unshift({
        label: `${this.user.first_name} ${this.user.last_name}`,
        icon: "pi pi-fw pi-user",
      });
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // this.loadMenu();
  }

  userMenus: MenuItem[] = [
    {
      label: "Change password",
      icon: "pi pi-fw pi-lock",
      command: ($event) => this.changePassword(),
    },
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
          label: "Configuration Settings",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "configuration-setting",
        },
        {
          label: "Advertisements",
          icon: "pi pi-fw pi-link",
          routerLink: "advertisement",
        },
        {
          label: "Financial Year Management",
          icon: "pi pi-fw pi-angle-down",
          items: [
            {
              label: "Financial Years",
              icon: "pi pi-fw pi-link",
              routerLink: "financial-year",
            },
            {
              label: "Periods",
              icon: "pi pi-fw pi-link",
              routerLink: "period",
            },
            {
              label: "Period Groups",
              icon: "pi pi-fw pi-link",
              routerLink: "period-group",
            },
          ],
        },
        {
          label: "User Management",
          icon: "pi pi-fw pi-angle-down",
          items: [
            {
              label: "Users",
              icon: "pi pi-fw pi-link",
              routerLink: "user",
            },
            {
              label: "Roles",
              icon: "pi pi-fw pi-link",
              routerLink: "role",
            },
            {
              label: "Menu",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "menu",
            },
            {
              label: "Groups",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "group",
            },
            {
              label: "Permissions",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "permission",
            },
          ],
        },
        {
          label: "Finance",
          icon: "pi pi-fw pi-angle-down",
          items: [
            {
              label: "Projects",
              icon: "pi pi-fw pi-link",
              routerLink: "project",
            },
            {
              label: "Fund Source Categories",
              icon: "pi pi-fw pi-link",
              routerLink: "fund-source-category",
            },
            {
              label: "Budget Classes",
              icon: "pi pi-fw pi-link",
              routerLink: "budget-class",
            },
            {
              label: "Fund Sources",
              icon: "pi pi-fw pi-link",
              routerLink: "fund-source",
            },
            {
              label: "Fund Types",
              icon: "pi pi-fw pi-link",
              routerLink: "fund-type",
            },
            {
              label: "Bank Accounts",
              icon: "pi pi-fw pi-link",
              routerLink: "bank-account",
            },
            {
              label: "Ceilings",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "fund-source-budget-class",
            },
          ],
        },
        {
          label: "Administrative Settings",
          icon: "pi pi-fw pi-angle-down",
          items: [
            {
              label: "Hierarchy Levels",
              icon: "pi pi-fw pi-link",
              routerLink: "admin-hierarchy-level",
            },
            {
              label: "Admin Hierarchies",
              icon: "pi pi-fw pi-link",
              routerLink: "admin-hierarchy",
            },
            {
              label: "Planning Units",
              icon: "pi pi-fw pi-link",
              routerLink: "section",
            },
            {
              label: "Decision Levels",
              icon: "pi pi-fw pi-link",
              routerLink: "decision-level",
            },
            {
              label: "Sectors",
              icon: "pi pi-fw pi-link",
              routerLink: "sector",
            },
            {
              label: "Planning Unit Levels",
              icon: "pi pi-fw pi-link",
              routerLink: "section-level",
            },
            {
              label: "Calendars",
              icon: "pi pi-fw pi-link",
              routerLink: "calendar",
            },
            {
              label: "Calendar Events",
              icon: "pi pi-fw pi-link",
              routerLink: "calendar-event",
            },
          ],
        },
        {
          label: "Facility",
          icon: "pi pi-fw pi-angle-down",
          items: [
            {
              label: "Facilities",
              icon: "pi pi-fw pi-link",
              routerLink: "facility",
            },
            {
              label: "Facility Types",
              icon: "pi pi-fw pi-link",
              routerLink: "facility-type",
            },
            {
              label: "Facility Custom Detail Mappings",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "facility-custom-detail-mapping",
            },
            {
              label: "Facility Custom Details",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "facility-custom-detail",
            },
          ],
        },
        {
          label: "GFS Code Management",
          icon: "pi pi-fw pi-angle-down",
          items: [
            {
              label: "GFS Code",
              icon: "pi pi-fw pi-link",
              routerLink: "gfs-code",
            },
            {
              label: "Gfs Code Categories",
              icon: "pi pi-fw pi-link",
              routerLink: "gfs-code-category",
            },
            {
              label: "Account Types",
              icon: "pi pi-fw pi-link",
              routerLink: "account-type",
            },
          ],
        },
        {
          label: "Planning",
          icon: "pi pi-fw pi-angle-down",
          items: [
            {
              label: "Objective Types",
              icon: "pi pi-fw pi-link",
              routerLink: "objective-type",
            },
            {
              label: "Priority Areas",
              icon: "pi pi-fw pi-link",
              routerLink: "priority-area",
            },
            {
              label: "Planning Sequence",
              icon: "pi pi-fw pi-link",
              routerLink: "objective",
            },
            {
              label: "Performance Indicators",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "performance-indicator",
            },
            {
              label: "Long Term Targets",
              icon: "pi pi-fw pi-link",
              routerLink: "long-term-target",
            },
            {
              label: "Activity Types",
              icon: "pi pi-fw pi-link",
              routerLink: "activity-type",
            },
            {
              label: "Activity Task Natures",
              icon: "pi pi-fw pi-link",
              routerLink: "activity-task-nature",
            },
            {
              label: "Reference Document Types",
              icon: "pi pi-fw pi-link",
              routerLink: "reference-document_type",
            },
            {
              label: "Strategic Plans",
              icon: "pi pi-fw pi-link",
              routerLink: "strategic-plan",
            },
            {
              label: "Guidelines",
              icon: "pi pi-fw pi-link",
              routerLink: "reference-document",
            },
            {
              label: "National Reference Types",
              icon: "pi pi-fw pi-link",
              routerLink: "cas-assessment-round",
            },
            {
              label: "Comprehensive Plans",
              icon: "pi pi-fw pi-angle-down",
              items: [
                {
                  label: "Cas Plans",
                  icon: "pi pi-fw pi-link",
                  routerLink: "cas-plan",
                },
                {
                  label: "Cas Plan Contents",
                  icon: "pi pi-fw pi-link",
                  routerLink: "cas-plan-content",
                },
                {
                  label: "Data Elements",
                  icon: "pi pi-fw pi-link",
                  routerLink: "data-element",
                },
                {
                  label: "Data Sets",
                  icon: "pi pi-fw pi-link",
                  routerLink: "data-set",
                },
                {
                  label: "Option Sets",
                  icon: "pi pi-fw pi-link",
                  routerLink: "option-set",
                },
                {
                  label: "Category Options",
                  icon: "pi pi-fw pi-link",
                  routerLink: "category-option",
                },
                {
                  label: "Category Combinations",
                  icon: "pi pi-fw pi-link",
                  routerLink: "category-combination",
                },
                {
                  label: "Category Category Options",
                  icon: "pi pi-fw pi-link",
                  routerLink: "category-category-option",
                },
                {
                  label: "Categories",
                  icon: "pi pi-fw pi-link",
                  routerLink: "category",
                },
                {
                  label: "Baseline Data",
                  icon: "pi pi-fw pi-link",
                  routerLink: "baseline-statistic",
                },
                {
                  label: "Transport Facilities",
                  icon: "pi pi-fw pi-angle-down",
                  items: [
                    {
                      label: "Asset Uses",
                      icon: "pi pi-fw pi-link",
                      routerLink: "asset-use",
                    },
                    {
                      label: "Asset Conditions",
                      icon: "pi pi-fw pi-link",
                      routerLink: "asset-condition",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Budgeting",
          icon: "pi pi-fw pi-angle-down",
          items: [
            {
              label: "Ceiling Chains",
              icon: "pi pi-fw pi-link",
              routerLink: "ceiling-chain",
            },
            {
              label: "Personal Emolument",
              icon: "pi pi-fw pi-angle-down",
              items: [
                {
                  label: "Personal Emolument Budget Submission Forms",
                  icon: "pi pi-fw pi-link",
                  routerLink: "pe-form",
                },
                {
                  label: "Pe Sub Forms",
                  icon: "pi pi-fw pi-link",
                  routerLink: "pe-sub-form",
                },
                {
                  label: "PE Definitions",
                  icon: "pi pi-fw pi-link",
                  routerLink: "pe-definition",
                },
                {
                  label: "Pe Select Options",
                  icon: "pi pi-fw pi-link",
                  routerLink: "pe-select-option",
                },
              ],
            },
          ],
        },
        {
          label: "Comprehensive Plans",
          icon: "pi pi-fw pi-angle-down",
          items: [
            {
              label: "Cas Plans",
              icon: "pi pi-fw pi-link",
              routerLink: "cas-plan",
            },
            {
              label: "Cas Plan Contents",
              icon: "pi pi-fw pi-link",
              routerLink: "cas-plan-content",
            },
            {
              label: "Data Elements",
              icon: "pi pi-fw pi-link",
              routerLink: "data-element",
            },
            {
              label: "Data Sets",
              icon: "pi pi-fw pi-link",
              routerLink: "data-set",
            },
            {
              label: "Option Sets",
              icon: "pi pi-fw pi-link",
              routerLink: "option-set",
            },
            {
              label: "Category Options",
              icon: "pi pi-fw pi-link",
              routerLink: "category-option",
            },
            {
              label: "Category Combinations",
              icon: "pi pi-fw pi-link",
              routerLink: "category-combination",
            },
            {
              label: "Category Category Options",
              icon: "pi pi-fw pi-link",
              routerLink: "category-category-option",
            },
            {
              label: "Categories",
              icon: "pi pi-fw pi-link",
              routerLink: "category",
            },
            {
              label: "Baseline Data",
              icon: "pi pi-fw pi-link",
              routerLink: "baseline-statistic",
            },
          ],
        },
        {
          label: "National References",
          icon: "pi pi-fw pi-angle-down",
          items: [
            {
              label: "National Reference Types",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "reference-type",
            },
            {
              label: "National References",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "national-reference",
            },
          ],
        },
        {
          label: "Assessment",
          icon: "pi pi-fw pi-angle-right",
          items: [
            {
              label: "Cas Assessment Categories",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "cas-assessment-category",
            },
            {
              label: "Cas Assessment Category Version",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "cas-assessment-category-version",
            },
            {
              label: "Cas Assessment Category Version State",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "cas-assessment-category-version-state",
            },
            {
              label: "Cas Assessment Round",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "cas-assessment-round",
            },
            {
              label: "Cas Assessment State",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "cas-assessment-state",
            },
            {
              label: "Cas Assessment Criteria Option",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "cas-assessment-criteria-option",
            },
            {
              label: "Cas Assessment Sub Criteria Option",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "cas-assessment-sub-criteria-option",
            },
            {
              label: "Cas Assessment Sub Criteria Possible Scores",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "cas-assessment-sub-criteria-possible_score",
            },
            {
              label: "Cas Assessment Sub Criteria Report Sets",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "cas-assessment-sub-criteria-report_set",
            },
          ],
        },
      ],
    },
    {
      label: "Project Outputs",
      icon: "pi pi-fw pi-arrow-right",
      routerLink: "project-output",
    },
    {
      label: "Intervention Categories",
      icon: "pi pi-fw pi-arrow-right",
      routerLink: "intervention-category",
    },
    {
      label: "Interventions",
      icon: "pi pi-fw pi-arrow-right",
      routerLink: "intervention",
    },
    {
      label: "Planning Matrices",
      icon: "pi pi-fw pi-arrow-right",
      routerLink: "planning-matrix",
    },
    {
      label: "Generic Sector Problems",
      icon: "pi pi-fw pi-arrow-right",
      routerLink: "generic-sector-problem",
    },
    {
      label: "Project Fund Sources",
      icon: "pi pi-fw pi-arrow-right",
      routerLink: "project-fund-source",
    },
    {
      label: "Project Sectors",
      icon: "pi pi-fw pi-arrow-right",
      routerLink: "project-sector",
    },
    {
      label: "Gfs Codes",
      icon: "pi pi-fw pi-arrow-right",
      routerLink: "gfs-code",
    },
    /**====Planrep setup Menu Generator Hook: Dont Delete====*/
    {
      label: "Planning",
      icon: "pi pi-pw pi-list",
      items: [
        {
          label: "Strategic Plans",
          icon: "pi pi-fw pi-link",
          routerLink: "strategic-plan",
        },
        {
          label: "Comprehensive Plans",
          icon: "pi pi-fw pi-angle-down",
          items: [
            {
              label: "Baseline Data",
              icon: "pi pi-fw pi-link",
              routerLink: "baseline-statistic-value",
            },
            {
              label: "Data Values",
              icon: "pi pi-fw pi-link",
              routerLink: "data-value",
            },
          ],
        },
        {
          label: "Planning",
          icon: "pi pi-fw pi-fw pi-link",
          items: [
            {
              label: "Opened",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "admin-hierarchy-cost-centres/CURRENT",
            },
            {
              label: "Approved",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "admin-hierarchy-cost-centres/APPROVED",
            },
            {
              label: "Carry Over",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "admin-hierarchy-cost-centres/CARRYOVER",
            },
            {
              label: "Vote Reallocation",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "admin-hierarchy-cost-centres/SUPPLEMENTARY",
            },
          ],
        },

        {
          label: "Responsible People",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "responsible-person",
        },
        {
          label: "Sector Problems",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "sector-problem",
        },
        /**====Planrep planning Menu Generator Hook: Dont Delete====*/
      ],
    },
    {
      label: "Budgeting",
      icon: "pi pi-pw pi-money-bill",
      items: [
        {
          label: "Ceiling Amounts",
          icon: "pi pi-fw pi-link",
          routerLink: "admin-hierarchy-ceiling",
        },
        {
          label: "PE Budget Submission Items",
          icon: "pi pi-fw pi-link",
          routerLink: "pe-item",
        },
        {
          label: "Scrutinizations",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "scrutinization",
        },
        /**====Planrep budgeting Menu Generator Hook: Dont Delete====*/
      ],
    },
    {
      label: "Execution",
      icon: "pi pi-pw pi-play",
      items: [
        {
          label: "Activity Implementation",
          icon: "pi pi-fw pi-arrow-right",
          items: [
            {
              label: "Approved",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "activity-implementation/APPROVED",
            },
            {
              label: "Carry Over",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "activity-implementation/CARRYOVER",
            },
            {
              label: "Vote Reallocation",
              icon: "pi pi-fw pi-arrow-right",
              routerLink: "activity-implementation/SUPPLEMENTARY",
            },
          ],
        },
        /**====Planrep execution Menu Generator Hook: Dont Delete====*/
      ],
    },
    {
      label: "Assessment",
      icon: "pi pi-pw pi-play",
      items: [
        {
          label: "Comprehensive Assessment",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "assessment-home",
        },
        {
          label: "Assessor Assignments",
          icon: "pi pi-fw pi-arrow-right",
          routerLink: "assessor-assignment",
        },
        {
          routerLink: "my-assessment",
        },
        {
          routerLink: "received-assessment",
        },
        {
          routerLink: "assessment-criteria",
        },
        /**====Planrep Assessment Menu Generator Hook: Dont Delete====*/
      ],
    },
  ];

  logout(): void {
    this.authService.logout().subscribe(() => {});
  }

  private loadMenu() {
    this.authService
      .currentUserMenu()
      .subscribe((resp: MenuItem[]) => (this.currentUserMenuItems = resp));
  }

  private changePassword() {
    this.dialogService.open(ChangePasswordComponent, {
      width: "40%",
      header: "Personal Password Change Form",
    });
  }
}
