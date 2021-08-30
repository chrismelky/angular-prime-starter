import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHierarchyTreeComponent } from './admin-hierarchy-tree.component';

describe('AdminHierarchyTreeComponent', () => {
  let component: AdminHierarchyTreeComponent;
  let fixture: ComponentFixture<AdminHierarchyTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHierarchyTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHierarchyTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
