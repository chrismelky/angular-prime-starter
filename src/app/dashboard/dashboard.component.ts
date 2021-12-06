import { Component, OnInit } from '@angular/core';
import { AdminHierarchy } from '../setup/admin-hierarchy/admin-hierarchy.model';
import { FinancialYear } from '../setup/financial-year/financial-year.model';
import { FinancialYearService } from '../setup/financial-year/financial-year.service';
import { Section } from '../setup/section/section.model';
import { EnumService } from '../shared/enum.service';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    protected financialYearService: FinancialYearService,
    protected dashboardService: DashboardService,
    protected enumService: EnumService
  ) {}

  financial_year_id?: number;
  financialYears?: FinancialYear[] = [];

  adminHierarchy?: AdminHierarchy;
  section?: Section;
  budgetType?: string = 'CURRENT';

  options = {
    responsive: true,
    maintainAspectRatio: true,
    barThickness: 35,
  };

  fundSourceCeilingBudget?: any;

  budgetTypes: any = [];

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ['id', 'name', 'status'] })
      .subscribe((resp) => {
        this.financialYears = resp.data || [];
        this.financial_year_id = this.financialYears?.find(
          (f) => f.status === 1
        )?.id;
        this.filterChanged();
      });
    this.budgetTypes = this.enumService.get('budgetTypes');
  }

  loadFundSourceCeilingBudget(refresh: boolean): void {
    if (
      !this.adminHierarchy ||
      !this.section ||
      !this.budgetType ||
      !this.financial_year_id
    ) {
      return;
    }
    const refreshFilter = refresh ? { refresh: true } : {};
    this.dashboardService
      .fundSourceCeilingAndBudget({
        financial_year_id: this.financial_year_id,
        admin_hierarchy_id: this.adminHierarchy?.id,
        parent_section_id: this.section?.id,
        parent_section_name: `p${this.section?.position}`,
        budget_type: this.budgetType,
        ...refreshFilter,
      })
      .subscribe((resp) => {
        if (resp.data?.length) {
          let labels: any = [];
          const ceiling: any = {
            label: 'Ceiling',
            data: [],
            backgroundColor: '#2196F3',
          };
          const budget: any = {
            label: 'Budget',
            data: [],
            backgroundColor: '#689F38',
          };
          resp.data.forEach((d: any) => {
            labels.push(d.fund_source);
            ceiling.data.push(d.ceiling);
            budget.data.push(d.budget);
          });

          this.fundSourceCeilingBudget = {
            lastUpdate: resp.data[0].last_update,
            labels: [...labels],
            datasets: [{ ...ceiling }, { ...budget }],
          };
        } else {
          this.fundSourceCeilingBudget = undefined;
        }
      });
  }

  filterChanged(): void {
    this.loadFundSourceCeilingBudget(false);
  }

  onAdminHierarchySelection(admin: AdminHierarchy): void {
    this.adminHierarchy = admin;
    this.filterChanged();
  }
  onSectionSelection(section: Section): void {
    this.section = section;
    this.filterChanged();
  }
}
