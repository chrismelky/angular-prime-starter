import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TreeNode} from "primeng/api";
import {OverlayPanel} from "primeng/overlaypanel";
import {UserService} from "../../setup/user/user.service";
import {LocalStorageService} from "ngx-webstorage";
import {AdminHierarchy} from "../../setup/admin-hierarchy/admin-hierarchy.model";
import {MenuService} from "../../setup/menu/menu.service";

@Component({
  selector: 'app-menu-tree',
  templateUrl: './menu-tree.component.html',
  styleUrls: ['./menu-tree.component.scss']
})
export class MenuTreeComponent implements OnInit, AfterViewInit {
  treeLoading: boolean = false;
  nodes: TreeNode[] = [];
  selectedValue: any;
  @Input() selectionMode: string = 'single';
  @Input() returnType: string = 'id';
  @Input() stateKey?: string;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @ViewChild('op') panel!: OverlayPanel;

  constructor(
    protected userService: UserService,
    protected menuService: MenuService,
    protected localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    if (this.stateKey && this.localStorageService.retrieve(`${this.stateKey}_state`)) {
      this.nodes = this.localStorageService.retrieve(`${this.stateKey}_state`);
      this.selectedValue = this.localStorageService.retrieve(
        `${this.stateKey}_selected`
      );
    }
    this.loadParents();
  }

  loadParents(): void {
    this.menuService.query({
        parent_id: null,
        columns: ['id', 'label'],
      }).subscribe(resp => {
      this.treeLoading = false;
      // @ts-ignore
      this.nodes = resp.data.map((a) => {
        return {
          label: a.label,
          key: a.id?.toString(),
          data: a,
          leaf: false,
          parent: undefined,
        };
      });
      this.selectedValue = this.nodes[0];
    });
  }

  ngAfterViewInit(): void {
    this.onSelectionChange();
  }

  nodeExpand(event: any): any {
    let selected: TreeNode = event.node;
    this.treeLoading = true;
    this.menuService
      .query({
        parent_id: selected.data.id,
        columns: ['id', 'label'],
      })
      .subscribe(
        (resp) => {
          this.treeLoading = false;
          selected.children = resp.data?.map((a) => {
            return {
              label: a.label,
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
      label: this.selectedValue?.label,
      data: this.selectedValue?.data,
      leaf: this.selectedValue?.leaf,
    });
  }
}
