export class PerformanceIndicator {
  constructor(
    public id?: number,
    public description?: string,
    public number?: string,
    public objective_id?: number,
    public section_id?: number,
    public is_qualitative?: string,
    public less_is_good?: string,
    public is_active?: string
  ) {}
}
