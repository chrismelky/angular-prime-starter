import { Component, OnInit } from '@angular/core';
import { AdminHierarchy } from '../setup/admin-hierarchy/admin-hierarchy.model';
import { FinancialYear } from '../setup/financial-year/financial-year.model';
import { FinancialYearService } from '../setup/financial-year/financial-year.service';
import { Section } from '../setup/section/section.model';
import { EnumService } from '../shared/enum.service';
import { CeilingBudgetRevenueExpenditure } from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { saveAs } from 'file-saver';
import { AdminHierarchyLevelService } from '../setup/admin-hierarchy-level/admin-hierarchy-level.service';
import { AdminHierarchyLevel } from '../setup/admin-hierarchy-level/admin-hierarchy-level.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    protected financialYearService: FinancialYearService,
    protected dashboardService: DashboardService,
    protected enumService: EnumService,
    protected adminLevelService: AdminHierarchyLevelService
  ) {}

  financial_year_id?: number;
  financialYears?: FinancialYear[] = [];
  adminLevels?: AdminHierarchyLevel[] = [];

  adminHierarchy?: AdminHierarchy;
  section?: Section;
  budgetType?: string = 'CURRENT';
  fundSourceIsLoading: boolean = false;
  aggregateIsLoading: boolean = false;
  cbreIsLoading: boolean = false;
  ceilingBudgetRevenueExpenditure?: CeilingBudgetRevenueExpenditure;
  isPE?: boolean = false;
  currentPosition?: number;
  lowerAdminLevel?: AdminHierarchyLevel;

  options = {
    plugins: {
      title: {
        text: '[ Ceiling Vs Budget ]',
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

  fundSourceCeilingBudget?: any;
  aggregateCeilingBudget?: any;

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

  onTabChange($event: any): void {
    switch ($event.index) {
      case 0:
        this.isPE = false;
        this.loadFundSourceCeilingBudget(false);
        break;
      case 1:
        this.isPE = true;
        this.loadFundSourceCeilingBudget(false);
    }
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
    const peFilter = this.isPE ? { isPE: true } : {};

    this.fundSourceIsLoading = true;
    this.dashboardService
      .fundSourceCeilingAndBudget({
        financial_year_id: this.financial_year_id,
        admin_hierarchy_id: this.adminHierarchy?.id,
        parent_section_id: this.section?.id,
        parent_section_name: `p${this.section?.position}`,
        budget_type: this.budgetType,
        ...refreshFilter,
        ...peFilter,
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

  refresh(isPE?: boolean): void {
    this.isPE = isPE;
    this.loadFundSourceCeilingBudget(true);
    this.loadCeilingBudgetRevenueExpenditure(true);
    this.loadLowerLevels();
  }

  onAdminHierarchySelection(admin: AdminHierarchy): void {
    this.adminHierarchy = admin;
    this.filterChanged();
    this.loadLowerLevels();
  }

  loadLowerLevels(): void {
    //Clear lower level data
    this.aggregateCeilingBudget = undefined;
    this.adminLevels = [];
    this.adminLevelService
      .lowerLevelsCanBudget(this.adminHierarchy?.admin_hierarchy_position)
      .subscribe(
        (resp) => {
          this.adminLevels = resp.data;
          if (this.adminLevels?.length) {
            this.lowerAdminLevel = this.adminLevels[0];
            this.loadLowerLevelCeilingBudget();
          }
        },
        (error) => {}
      );
  }

  loadLowerLevelCeilingBudget(refresh?: boolean): void {
    if (
      !this.adminHierarchy ||
      !this.lowerAdminLevel ||
      !this.budgetType ||
      !this.financial_year_id
    ) {
      return;
    }
    this.aggregateIsLoading = true;

    const refreshFilter = refresh ? { refresh: true } : {};
    this.dashboardService
      .aggregateCeilingAndBudget({
        financial_year_id: this.financial_year_id,
        parent_id: this.adminHierarchy?.id,
        parent_name: `p${this.adminHierarchy.admin_hierarchy_position}`,
        position: this.lowerAdminLevel.position,
        budget_type: this.budgetType,
        ...refreshFilter,
      })
      .subscribe(
        (resp) => {
          this.aggregateIsLoading = false;

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
              labels.push(d.admin_area);
              ceiling.data.push(d.ceiling);
              budget.data.push(d.budget);
              const percCompletion =
                d.ceiling && d.ceiling > 0 ? (d.budget / d.ceiling) * 100 : 0;
              completion.data.push(percCompletion);
            });

            this.aggregateCeilingBudget = {
              lastUpdate: resp.data[0].last_update,
              labels: [...labels],
              datasets: [{ ...ceiling }, { ...budget }, { ...completion }],
            };
          } else {
            this.aggregateCeilingBudget = undefined;
          }
        },
        (error) => {
          this.aggregateIsLoading = false;
        }
      );
  }

  onSectionSelection(section: Section): void {
    this.section = section;
    this.filterChanged();
  }

  downloadMismatch() {
    this.dashboardService
      .downloadMismatch(this.financial_year_id!, this.adminHierarchy?.id!)

      .subscribe((resp: BlobPart) => {
        saveAs(
          new Blob([resp], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          this.adminHierarchy?.name + '_mismatch.xlsx'
        );
      });
  }
}
