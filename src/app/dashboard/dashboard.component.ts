import { Component, OnInit } from '@angular/core';
import { AdminHierarchy } from '../setup/admin-hierarchy/admin-hierarchy.model';
import { FinancialYear } from '../setup/financial-year/financial-year.model';
import { FinancialYearService } from '../setup/financial-year/financial-year.service';
import { Section } from '../setup/section/section.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(protected financialYearService: FinancialYearService) {}
  financial_year_id?: number;
  financialYears?: FinancialYear[] = [];
  data: any;

  ngOnInit(): void {
    this.data = {
      labels: ['Ceiling', 'Budget'],
      datasets: [
        {
          data: [300, 50],
          backgroundColor: ['#3F51B5', 'rgb(239 108 0)'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB'],
        },
      ],
    };
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe((resp) => (this.financialYears = resp.data));
  }

  filterChanged(): void {
    // this.dataValues = [];
    // this.prepareDataValuesArray();
  }

  onAdminHierarchySelection(admin: AdminHierarchy): void {}
  onSectionSelection(aection: Section): void {}
}
