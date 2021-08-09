import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { createRequestOption } from '../../utils/request-util';
import { CustomResponse } from '../../utils/custom-response';
import { FacilityType } from './facility-type.model';

@Injectable({ providedIn: 'root' })
export class FacilityTypeService {
  public resourceUrl = 'api/facility-types';

  constructor(protected http: HttpClient) {}

  create(facilityType: FacilityType): Observable<CustomResponse<FacilityType>> {
    return this.http.post<CustomResponse<FacilityType>>(
      this.resourceUrl,
      facilityType
    );
  }

  update(facilityType: FacilityType): Observable<CustomResponse<FacilityType>> {
    return this.http.put<CustomResponse<FacilityType>>(
      `${this.resourceUrl}/${facilityType.id}`,
      facilityType
    );
  }

  find(id: number): Observable<CustomResponse<FacilityType>> {
    return this.http.get<CustomResponse<FacilityType>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<FacilityType[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<FacilityType[]>>(this.resourceUrl, {
      params: options,
    });
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
