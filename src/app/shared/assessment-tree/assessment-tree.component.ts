import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {TreeNode} from "primeng/api";
import {AssessmentCriteriaService} from "../../planning/assessment-criteria/assessment-criteria.service";
import {AdminHierarchy} from "../../setup/admin-hierarchy/admin-hierarchy.model";
import {AdminHierarchyService} from "../../setup/admin-hierarchy/admin-hierarchy.service";
import {ToastService} from "../toast.service";

@Component({
  selector: 'app-assessment-tree',
  templateUrl: './assessment-tree.component.html',
  styleUrls: ['./assessment-tree.component.scss'],
})

export class AssessmentTreeComponent implements OnInit {
  treeLoading: boolean = false;
  nodes: TreeNode[] = [];
  selectedValue: any;
  @Input() selectionMode: string = 'single';
  @Input() returnType: string = 'id';
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  adminHierarchies?: AdminHierarchy[] = [];
  constructor(
    protected assessmentCriteriaService: AssessmentCriteriaService,
    private toastService: ToastService,
    protected adminHierarchyService: AdminHierarchyService
  ) {
  }
  ngOnInit(): void {
    this.assessmentCriteriaService.getDataByUser()
      .subscribe((resp) => {
        this.adminHierarchies = resp.data.adminHierarchies;
        if (this.adminHierarchies){
          for (let i = 0; i < this.adminHierarchies.length; i++) {
            this.nodes.push({
              label: this.adminHierarchies[i].name,
              data: {id:this.adminHierarchies[i].id,code:this.adminHierarchies[i].code,admin_hierarchy_position:this.adminHierarchies[i].admin_hierarchy_position},
              children: [],
              leaf: false,
            });
          }
          this.selectedValue = this.nodes[0];
          this.onSelectionChange();
        }else {
          this.toastService.info(resp.message);
        }
      });
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
  }
}
