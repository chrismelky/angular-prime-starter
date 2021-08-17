import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { createRequestOption } from '../../utils/request-util';
import { CustomResponse } from '../../utils/custom-response';
import { Facility } from './facility.model';

@Injectable({ providedIn: 'root' })
export class FacilityService {
  public resourceUrl = 'api/facilities';

  constructor(protected http: HttpClient) {}

  create(facility: Facility): Observable<CustomResponse<Facility>> {
    return this.http.post<CustomResponse<Facility>>(this.resourceUrl, facility);
  }

  update(facility: Facility): Observable<CustomResponse<Facility>> {
    return this.http.put<CustomResponse<Facility>>(
      `${this.resourceUrl}/${facility.id}`,
      facility
    );
  }

  find(id: number): Observable<CustomResponse<Facility>> {
    return this.http.get<CustomResponse<Facility>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Facility[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Facility[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
