import { AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { User } from 'src/app/setup/user/user.model';
import { UserService } from 'src/app/setup/user/user.service';

@Component({
  selector: 'app-admin-hierarchy-tree',
  templateUrl: './admin-hierarchy-tree.component.html',
  styleUrls: ['./admin-hierarchy-tree.component.scss'],
})
export class AdminHierarchyTreeComponent implements OnInit, AfterViewInit {
  currentUser!: User;
  treeLoading: boolean = false;
  nodes: TreeNode[] = [];
  selectedValue: any;
  @Input() selectionMode: string = 'single';
  @Input() returnType: string = 'id';
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @ViewChild('op') panel!: OverlayPanel;

  constructor(
    protected userService: UserService,
    protected adminHierarchyService: AdminHierarchyService
  ) {
    this.currentUser = userService.getCurrentUser();
  }

  ngOnInit(): void {
    const rootAdminHierarchy = this.currentUser.admin_hierarchy;
    if (rootAdminHierarchy) {
      this.nodes = [
        {
          label: rootAdminHierarchy.name,
          data: rootAdminHierarchy,
          children: [],
          leaf: false,
        },
      ];
      this.selectedValue = this.nodes[0];
    }
  }

  ngAfterViewInit(): void {
    this.onSelectionChange();
  }

  nodeExpand(event: any): any {
    let selected: TreeNode = event.node;
    this.treeLoading = true;
    this.adminHierarchyService
      .query({
        parent_id: selected.data.id,
        columns: ['id', 'name', 'code', 'admin_hierarchy_position'],
      })
      .subscribe(
        (resp) => {
          this.treeLoading = false;
          selected.children = resp.data?.map((a) => {
            return {
              label: a.name,
              data: a,
              leaf: false,
            };
          });
        },
        (error) => {
          this.treeLoading = false;
        }
      );
  }

  onSelectionChange(event?: any): void {
    const selection =
      typeof this.selectedValue === 'object'
        ? this.returnType === 'object'
          ? this.selectedValue?.data
          : this.selectedValue?.data?.id
        : this.selectedValue?.data?.map((d: AdminHierarchy) => {
            return this.returnType === 'object' ? d : d.id;
          });
    this.onSelect.next(selection);
    this.panel.hide();
  }
}
