import {Role} from "../role.model";
import {Permission} from "../../permission/permission.model";

export class RolePermission {
  constructor(
    public id?: number,
    public role_id?: number,
    public role?: Role,
    public permission_id?: number,
    public permission?: Permission,
  ) {}
}

export class CreateRolePermission {
  constructor(
    public role_id?: number,
    public permissions?: Permission[]
  ) {
  }
}
