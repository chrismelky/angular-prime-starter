import { NationalReference } from '../national-reference/national-reference.model';
import { ReferenceDocument } from '../reference-document/reference-document.model';

export class PlanningMatrix {
  constructor(
    public id?: number,
    public name?: string,
    public reference_document_id?: number,
    public reference_document?: ReferenceDocument
  ) {}
}
