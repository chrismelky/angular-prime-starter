import { CategoryCombination } from '../category-combination/category-combination.model';
import { CategoryOption } from '../category-option/category-option.model';
import { OptionSet } from '../option-set/option-set.model';

export class CategoryOptionCombination {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public sort_order?: number,
    public option_set_id?: number,
    public value_type?: string,
    public category_options?: CategoryOption[],
    public category_option_ids?: number[],
    public category_combinations?: CategoryCombination[],
    public option_set?: OptionSet,
    public columnTotal?: number,
    public is_calculated?: boolean,
    public formular?: string
  ) {}
}
