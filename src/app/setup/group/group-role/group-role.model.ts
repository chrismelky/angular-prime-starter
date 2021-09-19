import {Role} from "../../role/role.model";

export class GroupRole {
  constructor(
    public id?: number,
    public group_id?: number,
    public role_id?: number
  ) {}
}

export class CreateGroupRole {
  constructor(
    public group_id?: number,
    public roles?: Role[],
  ) {
  }
}
