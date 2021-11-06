export class ReportSetup {
  constructor(
    public id?: number,
    public name?: string,
    public template_name?: string,
    public query_params?: ParameterList[],
    public sql_query?: string
  ) {}
}

export class ParameterList {
  constructor(
    public id?: number,
    public name?: string,
    public value?: string,
  ) {}
}
