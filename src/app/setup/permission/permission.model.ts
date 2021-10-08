export class Permission {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string
  ) {}
}

export class AllPermissionAndAssigned {
  constructor(
    public all?: Permission[],
    public assigned?: Permission[],
  ) {}
}

