import { CategoryOption } from '../category-option/category-option.model';

export class CategoryOptionCombination {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public category_options?: CategoryOption[],
    public category_option_ids?: number[]
  ) {}
}
