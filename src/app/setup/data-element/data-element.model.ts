import { DataElementGroup } from '../data-element-group/data-element-group.model';
import { OptionSet } from '../option-set/option-set.model';

export class DataElement {
  constructor(
    public id?: number,
    public name?: string,
    public display_name?: string,
    public code?: string,
    public question_number?: string,
    public data_set_id?: number,
    public category_combination_id?: number,
    public option_set_id?: number,
    public option_set?: OptionSet,
    public sort_order?: number,
    public value_type?: string,
    public is_required?: string,
    public data_element_group_set_id?: number,
    public data_element_group_id?: number,
    public group?: DataElementGroup,
    public groupName?: string
  ) {}
}
