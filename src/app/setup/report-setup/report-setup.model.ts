export class ReportSetup {
  constructor(
    public id?: number,
    public name?: string,
    public template_name?: string,
    public orientation?: string,
    public query_params?: string,
    public sql_query?: string
  ) {}
}

export class OrientationList {
  constructor(
    public id?: number,
    public name?: string,
    public value?: string,
  ) {}
}
