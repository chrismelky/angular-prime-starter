import { Category } from '../category/category.model';

export class CategoryCategoryCombination {
  constructor(
    public id?: number,
    public category_id?: number,
    public category_combination_id?: number,
    public category?: Category
  ) {}
}
