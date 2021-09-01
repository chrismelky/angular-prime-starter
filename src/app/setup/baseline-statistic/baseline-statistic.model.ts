export class BaselineStatistic {
  constructor(
    public id?: number,
    public description?: string,
    public code?: string,
    public default_value?: string,
    public is_common?: boolean,
    public hmis_uid?: string,
    public active?: boolean
  ) {}
}
