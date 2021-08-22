export class Calendar {
  constructor(
    public id?: number,
    public description?: string,
    public start_date?: string,
    public end_date?: string,
    public hierarchy_position?: number,
    public before_start_reminder_sms?: string,
    public before_end_reminder_sms?: string,
    public before_start_reminder_days?: number,
    public before_end_reminder_days?: number,
    public financial_year_id?: number,
    public cas_assessment_round_id?: number,
    public section_level_id?: number,
    public sector_id?: number
  ) {}
}
