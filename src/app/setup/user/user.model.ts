import { Role } from '../role/role.model';

export class User {
  constructor(
    public id?: number,
    public first_name?: string,
    public last_name?: string,
    public email?: string,
    public cheque_number?: string,
    public username?: string,
    public activated?: string,
    public title?: string,
    public mobile_number?: string,
    public is_super_user?: boolean,
    public has_facility_limit?: boolean,
    public active?: boolean,
    public roles?: Role[]
  ) {}
}
