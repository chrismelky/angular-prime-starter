export class ConfigurationSetting {
  constructor(
    public id?: number,
    public key?: string,
    public value?: string,
    public name?: string,
    public group_name?: string,
    public value_type?: string,
    public value_options?: string,
    public value_option_query?: string
  ) {}
}
