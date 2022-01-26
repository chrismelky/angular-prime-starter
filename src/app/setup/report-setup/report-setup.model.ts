export class ReportSetup {
  constructor(
    public id?: number,
    public name?: string,
    public template_name?: string,
    public orientation?: string,
    public query_params?: any,
    public sql_query?: string,
    public jasper_server_id?: string
  ) {}
}

export class OrientationList {
  constructor(
    public id?: number,
    public name?: string,
    public value?: string
  ) {}
}
export class QueryParamsList {
  constructor(public name?: string, public value?: string) {}
}
