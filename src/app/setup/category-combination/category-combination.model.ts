import { CategoryCategoryCombination } from '../category-category-combination/category-category-combination.model';
import { CategoryOptionCombination } from '../category-option-combination/category-option-combination.model';
import { Category } from '../category/category.model';
import { DataElement } from '../data-element/data-element.model';

export class CategoryCombination {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public has_row_total?: boolean,
    public has_column_total?: boolean,
    public category_category_combinations?: CategoryCategoryCombination[],
    public categories?: Category[],
    public category_option_combinations?: CategoryOptionCombination[],
    public dataElementGroups?: { name: string; values: DataElement[] }[],
    public sort_order?: number
  ) {}
}
