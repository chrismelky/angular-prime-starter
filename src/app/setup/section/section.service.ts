import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { createRequestOption } from '../../utils/request-util';
import { CustomResponse } from '../../utils/custom-response';
import { Section } from './section.model';

@Injectable({ providedIn: 'root' })
export class SectionService {
  public resourceUrl = 'api/sections';

  constructor(protected http: HttpClient) {}

  create(section: Section): Observable<CustomResponse<Section>> {
    return this.http.post<CustomResponse<Section>>(this.resourceUrl, section);
  }

  update(section: Section): Observable<CustomResponse<Section>> {
    return this.http.put<CustomResponse<Section>>(
      `${this.resourceUrl}/${section.id}`,
      section
    );
  }

  find(id: number): Observable<CustomResponse<Section>> {
    return this.http.get<CustomResponse<Section>>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<CustomResponse<Section[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Section[]>>(this.resourceUrl, {
      params: options,
    });
  }

  /**
   * Retrieve section that can be mapped with target e,g Department
   * ie. section by parent or section by current user section
   * @param parent user section position as parent name e.g p1 for position 1 or p2 for position 2
   * @param parentId user mappred section id
   * @param userSectionId user mapped section id
   * @returns
   */
  targetSections(
    parent: string,
    parentId: number,
    userSectionId: number
  ): Observable<CustomResponse<Section[]>> {
    return this.http.get<CustomResponse<Section[]>>(
      `${this.resourceUrl}/target-sections/${parent}/${parentId}/${userSectionId}`
    );
  }

  /**
   * ie. section by parent or section by current user section
   * @param parent user section position as parent name e.g p1 for position 1 or p2 for position 2
   * @param parentId user mappred section id
   * @param userSectionId user mapped section id
   * @returns
   */
  sectionsByParent(
    parent: string,
    parentId: number,
    userSectionId: number
  ): Observable<CustomResponse<Section[]>> {
    return this.http.get<CustomResponse<Section[]>>(
      `${this.resourceUrl}/sections-by-parent/${parent}/${parentId}/${userSectionId}`
    );
  }

  costCentreSections(): Observable<CustomResponse<Section[]>> {
    return this.http.get<CustomResponse<Section[]>>(
      `${this.resourceUrl}/cost-centre-sections`
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }

  departmentCostCenter(): Observable<CustomResponse<any>> {
    return this.http.get<CustomResponse<any>>(
      `${this.resourceUrl}/department-cost-centers`
    );
  }

  departments(): Observable<CustomResponse<any>> {
    return this.http.get<CustomResponse<any>>(
      `${this.resourceUrl}/departments`
    );
  }

  departmentAndCostCentreTree(): Observable<CustomResponse<any>> {
    return this.http.get<CustomResponse<any>>(
      `${this.resourceUrl}/departmentAndCostCentreTree`
    );
  }

  updateView(): Observable<CustomResponse<null>> {
    return this.http.get<CustomResponse<null>>(
      `${this.resourceUrl}/update_view`
    );
  }

  peCostCenters():Observable<CustomResponse<Section[]>> {
    return this.http.get<CustomResponse<Section[]>>( `${this.resourceUrl}/pe-cost-centers`);
  }
}
