import { Component, OnInit } from "@angular/core";

import { BreakpointObserver } from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  gtMd!: Observable<boolean>;
  isGtMd = true;

  constructor(private breakPointObsever: BreakpointObserver) {
    this.gtMd = this.breakPointObsever
      .observe("(max-width: 959px)")
      .pipe(map((result) => !result.matches));
    this.gtMd.subscribe((value) => {
      this.isGtMd = value;
    });
  }

  ngOnInit(): void {}

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
}
