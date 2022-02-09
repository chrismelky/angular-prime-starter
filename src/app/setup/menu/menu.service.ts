/**  * @license */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, PartialObserver } from 'rxjs';

import { createRequestOption } from '../../utils/request-util';
import { CustomResponse } from '../../utils/custom-response';
import { Menu } from './menu.model';
import { MenuItem } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class MenuService {
  public resourceUrl = 'api/menus';

  constructor(protected http: HttpClient) {}

  create(menu: Menu): Observable<CustomResponse<Menu>> {
    return this.http.post<CustomResponse<Menu>>(this.resourceUrl, menu);
  }

  update(menu: Menu): Observable<CustomResponse<Menu>> {
    return this.http.put<CustomResponse<Menu>>(
      `${this.resourceUrl}/${menu.id}`,
      menu
    );
  }

  find(id: number): Observable<CustomResponse<Menu>> {
    return this.http.get<CustomResponse<Menu>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Menu[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Menu[]>>(this.resourceUrl, {
      params: options,
    });
  }

  currentUser(): Observable<CustomResponse<Menu>> {
    return this.http.get<CustomResponse<Menu>>(
      `${this.resourceUrl}/currentUser`
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
