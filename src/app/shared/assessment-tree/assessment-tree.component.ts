import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {TreeNode} from "primeng/api";
import {AssessmentCriteriaService} from "../../planning/assessment-criteria/assessment-criteria.service";
import {AdminHierarchy} from "../../setup/admin-hierarchy/admin-hierarchy.model";
import {AdminHierarchyService} from "../../setup/admin-hierarchy/admin-hierarchy.service";
import {ToastService} from "../toast.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../setup/user/user.service";
import {User} from "../../setup/user/user.model";
import {OverlayPanel} from "primeng/overlaypanel";
import {LocalStorageService} from "ngx-webstorage";

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
  @Input() stateKey?: string;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @ViewChild('op') panel!: OverlayPanel;
  adminHierarchies: AdminHierarchy[] = [];
  financial_year_id!: number;
  cas_assessment_round_id!: number;
  cas_assessment_category_version_id!: number;
  currentUser!: User;
  constructor(
    protected assessmentCriteriaService: AssessmentCriteriaService,
    protected localStorageService: LocalStorageService,
    protected userService: UserService,
    protected actRoute: ActivatedRoute,
    protected adminHierarchyService: AdminHierarchyService
  ) {
    this.currentUser = userService.getCurrentUser();
    this.cas_assessment_category_version_id = this.actRoute.snapshot.params.id;
    this.cas_assessment_round_id = this.actRoute.snapshot.params.round_id;
    this.financial_year_id = this.actRoute.snapshot.params.fy_id;
  }
  ngOnInit(): void {
    this.assessmentCriteriaService.getDataByUser(this.cas_assessment_round_id, this.financial_year_id,
      this.cas_assessment_category_version_id,this.currentUser.id,this.currentUser.admin_hierarchy?.admin_hierarchy_position)
        .subscribe((resp) => {
        this.adminHierarchies = resp.data.adminHierarchies;
        if (this.adminHierarchies.length > 0){
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
    this.panel.hide();
    this.localStorageService.store(`${this.stateKey}_selected`, {
      label: this.selectedValue.label,
      data: this.selectedValue.data,
      leaf: this.selectedValue.leaf,
    });
  }
}
