import { CategoryCategoryCombination } from '../category-category-combination/category-category-combination.model';
import { CategoryOptionCombination } from '../category-option-combination/category-option-combination.model';
import { Category } from '../category/category.model';

export class CategoryCombination {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public skip_total?: string,
    public category_category_combinations?: CategoryCategoryCombination[],
    public categories?: Category[],
    public category_option_combinations?: CategoryOptionCombination[]
  ) {}
}
