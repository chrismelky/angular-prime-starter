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
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { CasAssessmentRound } from 'src/app/setup/cas-assessment-round/cas-assessment-round.model';
import { CasAssessmentRoundService } from 'src/app/setup/cas-assessment-round/cas-assessment-round.service';
import { SectionLevel } from 'src/app/setup/section-level/section-level.model';
import { SectionLevelService } from 'src/app/setup/section-level/section-level.service';
import { Sector } from 'src/app/setup/sector/sector.model';
import { SectorService } from 'src/app/setup/sector/sector.service';
import { Calendar } from '../calendar.model';
import { CalendarService } from '../calendar.service';
import { ToastService } from 'src/app/shared/toast.service';
import { CalendarEvent } from '../../calendar-event/calendar-event.model';
import { CalendarEventService } from '../../calendar-event/calendar-event.service';

@Component({
  selector: 'app-calendar-update',
  templateUrl: './calendar-update.component.html',
})
export class CalendarUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  financialYears?: FinancialYear[] = [];
  casAssessmentRounds?: CasAssessmentRound[] = [];
  sectionLevels?: SectionLevel[] = [];
  sectors?: Sector[] = [];
  calendarEvents?: CalendarEvent[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, []],
    start_date: [null, []],
    end_date: [null, []],
    hierarchy_position: [null, []],
    before_start_reminder_sms: [null, []],
    before_end_reminder_sms: [null, []],
    before_start_reminder_days: [null, []],
    before_end_reminder_days: [null, []],
    financial_year_id: [null, [Validators.required]],
    cas_assessment_round_id: [null, []],
    section_level_id: [null, []],
    sector_id: [null, []],
    calendar_event_id: [null, [Validators.required]],
  });

  constructor(
    protected calendarService: CalendarService,
    protected financialYearService: FinancialYearService,
    protected casAssessmentRoundService: CasAssessmentRoundService,
    protected sectionLevelService: SectionLevelService,
    protected sectorService: SectorService,
    protected calendarEventService: CalendarEventService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.casAssessmentRoundService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentRound[]>) =>
          (this.casAssessmentRounds = resp.data)
      );
    this.sectionLevelService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) =>
          (this.sectionLevels = resp.data)
      );
    this.sectorService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
      );
    this.calendarEventService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CalendarEvent[]>) =>
          (this.calendarEvents = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create Calendar Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const calendar = this.createFromForm();
    if (calendar.id !== undefined) {
      this.subscribeToSaveResponse(this.calendarService.update(calendar));
    } else {
      this.subscribeToSaveResponse(this.calendarService.create(calendar));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Calendar>>
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
   * @param calendar
   */
  protected updateForm(calendar: Calendar): void {
    this.editForm.patchValue({
      id: calendar.id,
      description: calendar.description,
      start_date:
        calendar.start_date !== undefined
          ? new Date(calendar.start_date!)
          : calendar.start_date,
      end_date:
        calendar.end_date !== undefined
          ? new Date(calendar.end_date!)
          : calendar.end_date,
      hierarchy_position: calendar.hierarchy_position,
      before_start_reminder_sms: calendar.before_start_reminder_sms,
      before_end_reminder_sms: calendar.before_end_reminder_sms,
      before_start_reminder_days: calendar.before_start_reminder_days,
      before_end_reminder_days: calendar.before_end_reminder_days,
      financial_year_id: calendar.financial_year_id,
      cas_assessment_round_id: calendar.cas_assessment_round_id,
      section_level_id: calendar.section_level_id,
      sector_id: calendar.sector_id,
      calendar_event_id: calendar.calendar_event_id,
    });
  }

  /**
   * Return form values as object of type Calendar
   * @returns Calendar
   */
  protected createFromForm(): Calendar {
    return {
      ...new Calendar(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      start_date: this.editForm.get(['start_date'])!.value,
      end_date: this.editForm.get(['end_date'])!.value,
      hierarchy_position: this.editForm.get(['hierarchy_position'])!.value,
      before_start_reminder_sms: this.editForm.get([
        'before_start_reminder_sms',
      ])!.value,
      before_end_reminder_sms: this.editForm.get(['before_end_reminder_sms'])!
        .value,
      before_start_reminder_days: this.editForm.get([
        'before_start_reminder_days',
      ])!.value,
      before_end_reminder_days: this.editForm.get(['before_end_reminder_days'])!
        .value,
      financial_year_id: this.editForm.get(['financial_year_id'])!.value,
      cas_assessment_round_id: this.editForm.get(['cas_assessment_round_id'])!
        .value,
      section_level_id: this.editForm.get(['section_level_id'])!.value,
      sector_id: this.editForm.get(['sector_id'])!.value,
      calendar_event_id: this.editForm.get(['calendar_event_id'])!.value,
    };
  }
}
