export class GfsCodeCategory {
  constructor(
    public id?: number,
    public name?: string,
    public parent_id?: number,
    public type?: string,
    public active?: boolean
  ) {}
}

export class GfsCodeCategoryTree {
  constructor(
    public value?: number,
    public label?: string,
    public items?: GfsCodeCategoryTree[],
  ) {}
}
