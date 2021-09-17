import {Role} from "../../role/role.model";
import {User} from "../user.model";

export class UserRole {
  constructor(
    public id?: number,
    public role_id?: number,
    public role?: Role,
    public user_id?: number,
    public user?: User,
  ) {
  }
}

export class CreateUserRole {
  constructor(
    public user_id?: number,
    public roles?: Role[]
  ) {
  }
}
