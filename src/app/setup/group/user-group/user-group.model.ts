import {Group} from "../../group/group.model";
import {User} from "../../user/user.model";

export class UserGroup {
  constructor(
    public id?: number,
    public user_id?: number,
    public group_id?: number,
    public expire_date?: string,
  ) {
  }
}

export class CreateUserGroup {
  constructor(
    public user_id?: number,
    public group_id?: number,
    public groups?: Group[],
    public users?: User[],
    public expire_date?: string
  ) {
  }
}
