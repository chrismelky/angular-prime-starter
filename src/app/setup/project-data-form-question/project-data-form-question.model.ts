export class ProjectDataFormQuestion {
  options: any;
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public input_type?: string,
    public project_data_form_id?: number,
    public number?: string,
    public sort_order?: number,
    public is_active?: string
  ) {}
}

export class ProjectDataFormQuestionOption {
  constructor(
    public id?: number,
    public name?: string,
    public label?: string,
    public option_value?: string,
    public project_data_form_question_id?: number,
    public is_active?: string
  ) {}
}

