import {Permission} from "../../permission/permission.model";
import {Menu} from "../menu.model";

export class MenuPermission {
  constructor(
    public id?: number,
    public menu_id?: number,
    public menu?: Menu,
    public permission_id?: number,
    public permission?: Permission,
  ) {
  }
}

export class CreateMenuPermission {
  constructor(
    public menu_id?: number,
    public permissions?: Permission[]
  ) {
  }
}
