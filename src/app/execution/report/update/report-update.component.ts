/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { CasPlanContent } from 'src/app/setup/cas-plan-content/cas-plan-content.model';
import { CasPlanContentService } from 'src/app/setup/cas-plan-content/cas-plan-content.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { Report } from '../report.model';
import { ReportService } from '../report.service';
import { ToastService } from 'src/app/shared/toast.service';
import { PeriodService } from '../../../setup/period/period.service';
import { Period } from '../../../setup/period/period.model';
import { FundSource } from '../../../setup/fund-source/fund-source.model';
import { FundSourceService } from '../../../setup/fund-source/fund-source.service';
import { Section } from '../../../setup/section/section.model';
import { SectionService } from '../../../setup/section/section.service';
import { Sector } from '../../../setup/sector/sector.model';
import { SectorService } from '../../../setup/sector/sector.service';
import { J } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-report-update',
  templateUrl: './report-update.component.html',
})
export class ReportUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  casPlanContents?: CasPlanContent[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  periods?: Period[] = [];
  sections?: Section[] = [];
  sectors?: Sector[] = [];
  departments?: Section[] = [];
  fundSources?: FundSource[] = [];
  peFundSources?: FundSource[] = [];
  parameters: string[] | undefined;

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
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
    admin_hierarchy_id: [null, []],
    financial_year_id: [null, []],
  });

  constructor(
    protected reportService: ReportService,
    protected periodService: PeriodService,
    protected sectionService: SectionService,
    protected sectorService: SectorService,
    protected fundSourceService: FundSourceService,
    protected casPlanContentService: CasPlanContentService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.reportService
      .getParams(this.dialogConfig.data.report_id)
      .subscribe((resp: CustomResponse<Report[]>) => {
        const params = resp.data;
        if (params) {
          this.parameters = params[0].query_params?.split(',');
          for (let i = 0; i < this.parameters?.length!; i++) {
            if (this.parameters![i] == 'period_id') {
              this.periodService
                .query({ columns: ['id', 'name'] })
                .subscribe(
                  (resp: CustomResponse<Period[]>) => (this.periods = resp.data)
                );
            }
            if (this.parameters![i] == 'fund_source_id') {
              this.fundSourceService
                .query({ columns: ['id', 'name'] })
                .subscribe(
                  (resp: CustomResponse<FundSource[]>) =>
                    (this.fundSources = resp.data)
                );
            }
            if (this.parameters![i] == 'section_id') {
              this.sectionService
                .query({ position: 4 })
                .subscribe(
                  (resp: CustomResponse<Section[]>) =>
                    (this.sections = resp.data)
                );
            }
            if (this.parameters![i] == 'department_id') {
              this.sectionService
                .query({ position: 3 })
                .subscribe(
                  (resp: CustomResponse<Section[]>) =>
                    (this.departments = resp.data)
                );
            }
            if (this.parameters![i] == 'sector_id') {
              this.sectorService
                .query({ columns: ['id', 'name'] })
                .subscribe(
                  (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
                );
            }
            if (this.parameters![i] == 'fund_source_pe') {
              this.fundSourceService
                .getPeFundSource()
                .subscribe(
                  (resp: CustomResponse<FundSource[]>) =>
                    (this.peFundSources = resp.data)
                );
            }
          }
        }
      });
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

//get pdf report
  getPdfReport(format: string) {
    const data = JSON.parse(JSON.stringify(this.editForm.value));
    data.admin_hierarchy_id = this.dialogConfig.data.admin_hierarchy_id;
    data.financial_year_id = this.dialogConfig.data.financial_year_id;
    data.report_id = this.dialogConfig.data.report_id;
    data.budgetType = this.dialogConfig.data.budgetType;
    data.format = format;
    this.reportService.getReport(data).subscribe((resp) => {
      let file = new Blob([resp], { type: 'application/pdf' });
      let fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
      this.dialogRef.close(true);
    });
  }
  //get excel report
  getExcelReport(format: string) {
    const data = JSON.parse(JSON.stringify(this.editForm.value));
    data.admin_hierarchy_id = this.dialogConfig.data.admin_hierarchy_id;
    data.financial_year_id = this.dialogConfig.data.financial_year_id;
    data.report_id = this.dialogConfig.data.report_id;
    data.budgetType = this.dialogConfig.data.budgetType;
    data.format = format;
    this.reportService.getReport(data).subscribe((resp) => {
      let file = new Blob([resp], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let fileURL = URL.createObjectURL(file);
      window.open(fileURL,"_blank")
      this.dialogRef.close(true);
    });
  }
//get excel report
  getWordReport(format: string) {
    const data = JSON.parse(JSON.stringify(this.editForm.value));
    data.admin_hierarchy_id = this.dialogConfig.data.admin_hierarchy_id;
    data.financial_year_id = this.dialogConfig.data.financial_year_id;
    data.report_id = this.dialogConfig.data.report_id;
    data.budgetType = this.dialogConfig.data.budgetType;
    data.format = format;
    this.reportService.getReport(data).subscribe((resp) => {
      let file = new Blob([resp], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      let fileURL = URL.createObjectURL(file);
      window.open(fileURL,"_blank");
      this.dialogRef.close(true);
    });
  }

  /**
   * When form is valid Create Report or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const report = this.createFromForm();
    if (report.id !== undefined) {
      this.subscribeToSaveResponse(this.reportService.update(report));
    } else {
      this.subscribeToSaveResponse(this.reportService.create(report));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Report>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param report
   */
  protected updateForm(report: Report): void {
    this.editForm.patchValue({
      id: report.id,
      period_id: report.period_id,
      section_id: report.section_id,
      sector_id: report.sector_id,
      department_id: report.department_id,
      fund_source_id: report.fund_source_id,
      fund_source_pe: report.fund_source_pe,
      is_facility_account: report.is_facility_account,
      intervention_id: report.intervention_id,
      exchange_rate: report.exchange_rate,
      control_code: report.control_code,
      budget_class_id: report.budget_class_id,
      admin_hierarchy_id: report.admin_hierarchy_id,
      financial_year_id: report.financial_year_id,
    });
  }

  /**
   * Return form values as object of type Report
   * @returns Report
   */
  protected createFromForm(): Report {
    return {
      ...new Report(),
      id: this.editForm.get(['id'])!.value,
      period_id: this.editForm.get(['period_id'])!.value,
      fund_source_id: this.editForm.get(['fund_source_id'])!.value,
      fund_source_pe: this.editForm.get(['fund_source_pe'])!.value,
      is_facility_account: this.editForm.get(['is_facility_account'])!.value,
      intervention_id: this.editForm.get(['intervention_id'])!.value,
      exchange_rate: this.editForm.get(['exchange_rate'])!.value,
      control_code: this.editForm.get(['control_code'])!.value,
      budget_class_id: this.editForm.get(['budget_class_id'])!.value,
      department_id: this.editForm.get(['department_id'])!.value,
      section_id: this.editForm.get(['section_id'])!.value,
      sector_id: this.editForm.get(['sector_id'])!.value,
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
      financial_year_id: this.editForm.get(['financial_year_id'])!.value,
    };
  }
}
