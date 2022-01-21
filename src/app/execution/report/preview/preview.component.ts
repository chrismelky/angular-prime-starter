/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FundSource } from 'src/app/setup/fund-source/fund-source.model';
import { FundSourceService } from 'src/app/setup/fund-source/fund-source.service';
import { Intervention } from 'src/app/setup/intervention/intervention.model';
import { InterventionService } from 'src/app/setup/intervention/intervention.service';
import { Period } from 'src/app/setup/period/period.model';
import { PeriodService } from 'src/app/setup/period/period.service';
import { PriorityArea } from 'src/app/setup/priority-area/priority-area.model';
import { PriorityAreaService } from 'src/app/setup/priority-area/priority-area.service';
import { ReportSetup } from 'src/app/setup/report-setup/report-setup.model';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { Sector } from 'src/app/setup/sector/sector.model';
import { SectorService } from 'src/app/setup/sector/sector.service';
import { CustomResponse } from 'src/app/utils/custom-response';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, AfterViewInit {
  @ViewChild('reportBody') reportBody!: ElementRef;

  @Input() report!: ReportSetup;
  @Input() adminHierarchy!: AdminHierarchy;
  @Input() budgetType!: string;
  @Input() financialYear!: FinancialYear;
  @Input() params?: any;
  totalPages = 0;
  reportIsLoading: boolean = false;
  periods?: Period[] = [];
  sections?: Section[] = [];
  sectors?: Sector[] = [];
  departments?: Section[] = [];
  fundSources?: FundSource[] = [];
  peFundSources?: FundSource[] = [];

  priorityAreas?: PriorityArea[] = [];
  interventions?: Intervention[] = [];

  filter = {};
  formError = false;

  paramForm = this.fb.group({
    id: [null, []],
    budget_type: [null, [Validators.required]],
    period_id: [null, []],
    section_id: [null, []],
    sector_id: [null, []],
    fund_source_pe: [null, []],
    is_facility_account: [null, []],
    intervention_id: [null, []],
    exchange_rate: [null, []],
    control_code: [null, []],
    budget_class_id: [null, []],
    department_id: [null, []],
    fund_source_id: [null, []],
    admin_hierarchy_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    data_set_id: [null],
    facility_type_id: [null],
    facility_id: [null],
    priority_area_id: [null, []],
    parent: [null, []],
  });

  constructor(
    protected reportService: ReportService,
    protected sectionService: SectionService,
    protected sectorService: SectorService,
    protected fundSourceService: FundSourceService,
    protected priorityAreaService: PriorityAreaService,
    protected periodService: PeriodService,
    protected fb: FormBuilder,
    protected interventionService: InterventionService
  ) {}

  ngOnInit(): void {
    this.paramForm.patchValue({
      financial_year_id: this.financialYear.id,
      admin_hierarchy_id: this.adminHierarchy.id,
      budget_type: this.budgetType,
    });
    /** Load params if report has params */
    if (this.params) {
      if (this.params?.includes('period_id')) {
        this.periodService
          .query({ columns: ['id', 'name'] })
          .subscribe(
            (resp: CustomResponse<Period[]>) => (this.periods = resp.data)
          );
        this.paramForm.get('period_id')?.setValidators([Validators.required]);
      }
      if (this.params?.includes('fund_source_id')) {
        this.fundSourceService
          .query({ columns: ['id', 'name'] })
          .subscribe(
            (resp: CustomResponse<FundSource[]>) =>
              (this.fundSources = resp.data)
          );
        this.paramForm
          .get('fund_source_id')
          ?.setValidators([Validators.required]);
      }
      if (this.params?.includes('section_id')) {
        this.sectionService
          .query({ position: 4 })
          .subscribe(
            (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
          );
        this.paramForm.get('section_id')?.setValidators([Validators.required]);
      }
      if (this.params?.includes('department_id')) {
        this.sectionService
          .query({ position: 3 })
          .subscribe(
            (resp: CustomResponse<Section[]>) => (this.departments = resp.data)
          );
        this.paramForm
          .get('department_id')
          ?.setValidators([Validators.required]);
      }
      if (this.params?.includes('sector_id')) {
        this.sectorService
          .query({ columns: ['id', 'name'] })
          .subscribe(
            (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
          );
        this.paramForm.get('sector_id')?.setValidators([Validators.required]);
      }
      if (this.params?.includes('fund_source_pe')) {
        this.fundSourceService
          .getPeFundSource()
          .subscribe(
            (resp: CustomResponse<FundSource[]>) =>
              (this.peFundSources = resp.data)
          );
        this.paramForm
          .get('fund_source_pe')
          ?.setValidators([Validators.required]);
      }
    }
  }

  ngAfterViewInit(): void {
    document
      .querySelector('.report-sidebar .p-sidebar-header')
      ?.insertAdjacentHTML(
        'afterbegin',
        `<div style="display:flex; justify-content: center;flex-grow: 1"><span class='title'>${this.adminHierarchy.name} </span> &nbsp; |  ${this.budgetType} BUDGET  |  ${this.financialYear.name}</div>`
      );

    if (!this.params) {
      this.loadReport(1);
    }
  }

  getReport(): void {
    if (this.paramForm.invalid) {
      this.formError = true;
      return;
    }
    this.loadReport(1);
  }

  download(format?: string): void {
    if (this.report.jasper_server_id) {
      this.reportService.getJasperReport(
        `${this.report.jasper_server_id}`,
        {
          admin_hierarchy_id: this.adminHierarchy.id,
          financial_year_id: this.financialYear.id,
          budget_type: this.budgetType,
        },
        format
      );
    } else {
      this.reportService.getReport({
        admin_hierarchy_id: this.adminHierarchy.id,
        financial_year_id: this.financialYear.id,
        budget_type: this.budgetType,
        id: this.report.id,
        format: format,
      });
    }
  }

  loadReport(page?: number): void {
    this.reportIsLoading = true;

    if (this.report.jasper_server_id) {
      this.reportService
        .getJasperReportHtml(`${this.report.jasper_server_id}`, {
          ...this.paramForm.value,
          page: page,
        })
        .subscribe(
          (resp) => {
            this.reportIsLoading = false;
            this.renderReport(resp);
          },
          (error) => {
            this.reportIsLoading = false;
            console.log(error);
          }
        );
    } else {
      this.reportService
        .getReportHtml({
          ...this.paramForm.value,
          id: this.report.id,
        })
        .subscribe(
          (resp) => {
            this.reportIsLoading = false;
            this.renderReport(
              `<table width="100%" cellpadding="0" cellspacing="0"><tr><td class="layout" width="15%"></td><td class="layout" align="center">${resp}</td><td class="layout" width="15%"></td></tr></table>`
            );
          },
          (error) => {
            this.reportIsLoading = false;
            console.log(error);
          }
        );
    }
  }

  renderReport(content: any) {
    document.getElementById('reportHolder')?.remove();
    if (content) {
      this.reportBody.nativeElement.insertAdjacentHTML(
        'afterend',
        `<div id="reportHolder" style="position: relative">${content}<div>`
      );
    } else {
      this.reportBody.nativeElement.insertAdjacentHTML(
        'afterend',
        '<div id="reportHolder">No data Found!<div>'
      );
    }
    setTimeout(() => {
      const holder = document.getElementsByClassName('totalPages');
      this.totalPages =
        holder !== undefined && holder.length
          ? parseInt(holder[0].innerHTML)
          : 0;
    }, 500);
  }
}
