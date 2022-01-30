import { Component, OnInit } from '@angular/core';
import { PER_PAGE_OPTIONS } from 'src/app/config/pagination.constants';
import { ToastService } from 'src/app/shared/toast.service';
import { CustomResponse } from 'src/app/utils/custom-response';
import { CasPlan } from '../../cas-plan/cas-plan.model';
import { CasPlanService } from '../../cas-plan/cas-plan.service';
import { DataSet } from '../../data-set/data-set.model';
import { DataSetService } from '../../data-set/data-set.service';
import { FinancialYear } from '../../financial-year/financial-year.model';
import { FinancialYearService } from '../../financial-year/financial-year.service';
import { Period } from '../../period/period.model';
import { ImportStatus } from '../data-value.model';
import { DataValueService } from '../data-value.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  casPlans?: CasPlan[] = [];
  dataSets?: DataSet[] = [];
  financialYears?: FinancialYear[] = [];
  periods?: Period[] = [];

  financial_year_id?: number;
  cas_plan_id?: number;
  period_id?: number;
  dataSet!: DataSet;
  importStatus?: ImportStatus;
  isImporting = false;

  financialYearIsLoading = false;
  casContentIsLoading = false;
  dataSetIsLoading = false;
  errors: any[] = [];
  page: number = 1;
  per_page: number = 50;
  perPageOptions = PER_PAGE_OPTIONS;

  constructor(
    protected financialYearService: FinancialYearService,
    protected casPlanService: CasPlanService,
    protected dataSetService: DataSetService,
    protected dataValueService: DataValueService,
    protected toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadError();

    this.casContentIsLoading = true;
    this.casPlanService
      .query({
        columns: ['id', 'name', 'admin_hierarchy_position'],
      })
      .subscribe(
        (resp: CustomResponse<CasPlan[]>) => {
          this.casPlans = resp.data;
          this.casContentIsLoading = false;
        },
        (error) => {
          this.casContentIsLoading = false;
        }
      );

    this.financialYearService.query({ columns: ['id', 'name'] }).subscribe(
      (resp: CustomResponse<FinancialYear[]>) => {
        this.financialYears = resp.data;
        this.financialYearIsLoading = false;
      },
      (error) => {
        this.financialYearIsLoading = false;
      }
    );
  }

  /**
   * Load data set by cas plan
   */
  loadDataSets(): void {
    this.dataSetIsLoading = true;
    this.dataSetService
      .query({
        cas_plan_id: this.cas_plan_id,
        columns: ['id', 'name', 'facility_types', 'periods'],
      })
      .subscribe(
        (resp: CustomResponse<DataSet[]>) => {
          this.dataSetIsLoading = false;
          this.dataSets = resp.data;
        },
        (error) => {
          this.dataSetIsLoading = false;
        }
      );
  }

  /**
   * Load facility types from dataset facility_type json property, see @DataSet model
   */
  onDataSetChange(): void {
    this.periods =
      this.dataSet && this.dataSet.periods
        ? JSON.parse(this.dataSet.periods)
        : [];
  }

  import($event: any): void {
    if (!this.financial_year_id || !this.period_id) {
      return;
    }
    this.importStatus = undefined;
    this.isImporting = true;
    const formData = new FormData();
    formData.append('financial_year_id', this.financial_year_id!.toString());
    formData.append('period_id', this.period_id!.toString());
    formData.append('data_set_id', this.dataSet.id!.toString());
    // @ts-ignore
    formData.append('file', $event.files[0]);

    this.dataValueService.import(formData).subscribe(
      (resp) => {
        this.toastService.info('File uploaded successfully');
        this.importStatus = resp.data;
        this.isImporting = false;
        this.loadError();
      },
      (error) => {
        this.isImporting = false;
      }
    );
  }

  pageChanged(event: any): void {
    this.page = event.page + 1;
    this.per_page = event.rows!;
    this.loadError(this.page);
  }

  loadError(page?: number): void {
    if (!this.financial_year_id || !this.period_id) {
      return;
    }
    this.isImporting = true;

    this.dataValueService
      .errors({
        page: page || 1,
        per_page: this.per_page,
        financial_year_id: this.financial_year_id,
        period_id: this.period_id,
      })
      .subscribe(
        (resp) => {
          this.isImporting = false;

          this.errors = resp.data;
        },
        (error) => {
          this.isImporting = false;
        }
      );
  }

  reImport(): void {
    if (!this.financial_year_id || !this.period_id) {
      return;
    }
    this.importStatus = undefined;
    this.isImporting = true;
    this.dataValueService
      .reImport({
        financial_year_id: this.financial_year_id,
        period_id: this.period_id,
      })
      .subscribe(
        (resp) => {
          this.loadError();
          this.importStatus = resp.data;
          this.isImporting = false;
        },
        (error) => (this.isImporting = false)
      );
  }
}
