import { CategoryOption } from '../category-option/category-option.model';

export class Category {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public category_options?: CategoryOption[]
  ) {}
}
