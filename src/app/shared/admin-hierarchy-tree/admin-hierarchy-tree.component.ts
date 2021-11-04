import { AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
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
  @Input() stateKey?: string;
  @Input() label: string = 'Admin Hierarchy';
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @ViewChild('op') panel!: OverlayPanel;

  constructor(
    protected userService: UserService,
    protected adminHierarchyService: AdminHierarchyService,
    protected localStorageService: LocalStorageService
  ) {
    this.currentUser = userService.getCurrentUser();
  }

  ngOnInit(): void {
    const rootAdminHierarchy = this.currentUser.admin_hierarchy;
    const history = this.localStorageService.retrieve(`${this.stateKey}_state`);
    if (
      this.stateKey &&
      history &&
      rootAdminHierarchy?.id?.toString() === history[0].key
    ) {
      this.nodes = this.localStorageService.retrieve(`${this.stateKey}_state`);
      this.selectedValue = this.localStorageService.retrieve(
        `${this.stateKey}_selected`
      );
    } else {
      if (rootAdminHierarchy) {
        this.nodes = [
          {
            label: rootAdminHierarchy.name,
            data: rootAdminHierarchy,
            key: rootAdminHierarchy.id?.toString(),
            children: [],
            leaf: false,
          },
        ];
        this.selectedValue = this.nodes[0];
      }
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
        columns: ['id', 'name', 'code', 'admin_hierarchy_position','current_financial_year_id','carryover_financial_year_id','supplementary_financial_year_id'],
      })
      .subscribe(
        (resp) => {
          this.treeLoading = false;
          selected.children = resp.data?.map((a) => {
            return {
              label: a.name,
              key: a.id?.toString(),
              data: a,
              leaf: false,
              parent: undefined,
            };
          });
          if (this.stateKey) {
            this.localStorageService.store(
              `${this.stateKey}_state`,
              this.cleanNodes(this.nodes)
            );
          }
        },
        (error) => {
          this.treeLoading = false;
        }
      );
  }

  private cleanNodes(nodes: TreeNode[]): TreeNode[] {
    return nodes.map((n) => {
      return {
        ...n,
        parent: undefined,
        children: n.children ? this.cleanNodes(n.children) : [],
      };
    });
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
    this.localStorageService.store(`${this.stateKey}_selected`, {
      label: this.selectedValue.label,
      data: this.selectedValue.data,
      leaf: this.selectedValue.leaf,
    });
  }
}
