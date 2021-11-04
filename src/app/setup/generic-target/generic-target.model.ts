import { PerformanceIndicator } from '../performance-indicator/performance-indicator.model';
import { Section } from '../section/section.model';

export class GenericTarget {
  constructor(
    public id?: number,
    public description?: string,
    public params?: string,
    public objective_id?: number,
    public planning_matrix_id?: number,
    public is_active?: boolean,
    public sections: Section[] = [],
    public indicators: PerformanceIndicator[] = []
  ) {}
}
