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
import { CalendarEvent } from '../calendar-event.model';
import { CalendarEventService } from '../calendar-event.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-calendar-event-update',
  templateUrl: './calendar-event-update.component.html',
})
export class CalendarEventUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, []],
    number: [null, []],
    before_start_reminder_sms: [null, []],
    before_end_reminder_sms: [null, []],
    before_start_reminder_days: [null, []],
    before_end_reminder_days: [null, []],
    url: [null, []],
    expected_value_query: [null, []],
    actual_value_query: [null, []],
    is_system_event: [false, []],
  });

  constructor(
    protected calendarEventService: CalendarEventService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CalendarEvent Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const calendarEvent = this.createFromForm();
    if (calendarEvent.id !== undefined) {
      this.subscribeToSaveResponse(
        this.calendarEventService.update(calendarEvent)
      );
    } else {
      this.subscribeToSaveResponse(
        this.calendarEventService.create(calendarEvent)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CalendarEvent>>
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
   * @param calendarEvent
   */
  protected updateForm(calendarEvent: CalendarEvent): void {
    this.editForm.patchValue({
      id: calendarEvent.id,
      name: calendarEvent.name,
      number: calendarEvent.number,
      before_start_reminder_sms: calendarEvent.before_start_reminder_sms,
      before_end_reminder_sms: calendarEvent.before_end_reminder_sms,
      before_start_reminder_days: calendarEvent.before_start_reminder_days,
      before_end_reminder_days: calendarEvent.before_end_reminder_days,
      url: calendarEvent.url,
      expected_value_query: calendarEvent.expected_value_query,
      actual_value_query: calendarEvent.actual_value_query,
      is_system_event: calendarEvent.is_system_event,
    });
  }

  /**
   * Return form values as object of type CalendarEvent
   * @returns CalendarEvent
   */
  protected createFromForm(): CalendarEvent {
    return {
      ...new CalendarEvent(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      number: this.editForm.get(['number'])!.value,
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
      url: this.editForm.get(['url'])!.value,
      expected_value_query: this.editForm.get(['expected_value_query'])!.value,
      actual_value_query: this.editForm.get(['actual_value_query'])!.value,
      is_system_event: this.editForm.get(['is_system_event'])!.value,
    };
  }
}
