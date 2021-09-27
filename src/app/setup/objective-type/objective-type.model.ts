export class ObjectiveType {
  constructor(
    public id?: number,
    public name?: string,
    public position?: number,
    public is_incremental?: boolean,
    public is_sectoral?: boolean
  ) {}
}
