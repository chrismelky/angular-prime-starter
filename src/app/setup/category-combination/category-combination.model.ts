import { CategoryCategoryCombination } from '../category-category-combination/category-category-combination.model';

export class CategoryCombination {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public skip_total?: string,
    public category_category_combinations?: CategoryCategoryCombination[]
  ) {}
}
