export class Menu {
  constructor(
    public id?: number,
    public label?: string,
    public icon?: string,
    public separator?: string,
    public router_link?: string,
    public parent_id?: number,
    public sort_order?: number,
    public items?: Menu[],
  ) {
  }
}
