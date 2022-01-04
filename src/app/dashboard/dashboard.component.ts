import { Component, OnInit } from '@angular/core';
import { AdminHierarchy } from '../setup/admin-hierarchy/admin-hierarchy.model';
import { FinancialYear } from '../setup/financial-year/financial-year.model';
import { FinancialYearService } from '../setup/financial-year/financial-year.service';
import { Section } from '../setup/section/section.model';
import { EnumService } from '../shared/enum.service';
import { CeilingBudgetRevenueExpenditure } from './dashboard.model';
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
  fundSourceIsLoading: boolean = false;
  cbreIsLoading: boolean = false;
  ceilingBudgetRevenueExpenditure?: CeilingBudgetRevenueExpenditure;

  options = {
    plugins: {
      title: {
        text: 'Fund Sources [ Ceiling Vs Budget ]',
      },
      legend: {
        labels: {
          font: {
            size: 10,
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        position: 'left',
        grid: {
          borderDash: [4, 4],
        },
        title: {
          display: true,
          text: 'Amount (TZS)',
          font: {
            size: 9,
          },
        },
        ticks: {
          font: {
            size: 9,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 9,
          },
        },
      },
      complGrid: {
        id: 'B',
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Completion %',
          font: {
            size: 9,
          },
        },
        ticks: {
          font: {
            size: 9,
          },
          max: 100,
          min: 0,
        },
        grid: {
          display: false,
        },
      },
    },
    // barThickness: 35,
  };

  option2 = {
    responsive: true,
    maintainAspectRatio: false,
    // barThickness: 35,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 10,
          },
        },
      },
    },
  };

  data = {
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
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

  loadCeilingBudgetRevenueExpenditure(refresh: boolean): void {
    if (
      !this.adminHierarchy ||
      !this.section ||
      !this.budgetType ||
      !this.financial_year_id
    ) {
      return;
    }
    const refreshFilter = refresh ? { refresh: true } : {};
    this.cbreIsLoading = true;
    this.dashboardService
      .ceilingBudgetRevenueExpenditure({
        financial_year_id: this.financial_year_id,
        admin_hierarchy_id: this.adminHierarchy?.id,
        parent_section_id: this.section?.id,
        parent_section_name: `p${this.section?.position}`,
        budget_type: this.budgetType,
        ...refreshFilter,
      })
      .subscribe(
        (resp) => {
          this.cbreIsLoading = false;
          this.ceilingBudgetRevenueExpenditure = resp.data;
        },
        (error) => {
          this.cbreIsLoading = false;
        }
      );
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
    this.fundSourceIsLoading = true;
    this.dashboardService
      .fundSourceCeilingAndBudget({
        financial_year_id: this.financial_year_id,
        admin_hierarchy_id: this.adminHierarchy?.id,
        parent_section_id: this.section?.id,
        parent_section_name: `p${this.section?.position}`,
        budget_type: this.budgetType,
        ...refreshFilter,
      })
      .subscribe(
        (resp) => {
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
              backgroundColor: '#ffcb2b',
            };
            const completion: any = {
              label: 'Completion',
              data: [],
              backgroundColor: '#689f38',
              borderColor: '#689f38',
              borderWidth: 1,
              type: 'line',
              yAxisID: 'complGrid',
            };
            resp.data.forEach((d: any) => {
              labels.push(d.fund_source);
              ceiling.data.push(d.ceiling);
              budget.data.push(d.budget);
              const percCompletion =
                d.ceiling && d.ceiling > 0 ? (d.budget / d.ceiling) * 100 : 0;
              completion.data.push(percCompletion);
            });

            this.fundSourceCeilingBudget = {
              lastUpdate: resp.data[0].last_update,
              labels: [...labels],
              datasets: [{ ...ceiling }, { ...budget }, { ...completion }],
            };
          } else {
            this.fundSourceCeilingBudget = undefined;
          }
          this.fundSourceIsLoading = false;
        },
        (error) => {
          this.fundSourceIsLoading = false;
        }
      );
  }

  filterChanged(): void {
    this.loadFundSourceCeilingBudget(false);
    this.loadCeilingBudgetRevenueExpenditure(false);
  }

  refresh(): void {
    this.loadFundSourceCeilingBudget(true);
    this.loadCeilingBudgetRevenueExpenditure(true);
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
