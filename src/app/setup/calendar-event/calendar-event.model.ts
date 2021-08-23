export class CalendarEvent {
  constructor(
    public id?: number,
    public name?: string,
    public number?: number,
    public before_start_reminder_sms?: string,
    public before_end_reminder_sms?: string,
    public before_start_reminder_days?: number,
    public before_end_reminder_days?: number,
    public url?: string,
    public expected_value_query?: string,
    public actual_value_query?: string,
    public is_system_event?: string
  ) {}
}
