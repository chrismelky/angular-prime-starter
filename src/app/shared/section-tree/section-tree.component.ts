import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { User } from 'src/app/setup/user/user.model';
import { UserService } from 'src/app/setup/user/user.service';

@Component({
  selector: 'app-section-tree',
  templateUrl: './section-tree.component.html',
  styleUrls: ['./section-tree.component.scss'],
})
export class SectionTreeComponent implements OnInit {
  currentUser!: User;
  treeLoading: boolean = false;
  nodes: TreeNode[] = [];
  selectedValue: any;
  @Input() selectionMode: string = 'single';
  @Input() returnType: string = 'id';
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  constructor(
    protected userService: UserService,
    protected sectionService: SectionService
  ) {
    this.currentUser = userService.getCurrentUser();
    const rootSection = this.currentUser.section;
    this.nodes = rootSection
      ? [
          {
            label: rootSection.name,
            data: rootSection,
            children: [],
            leaf: false,
          },
        ]
      : [];
  }

  ngOnInit(): void {}

  nodeExpand(event: any): any {
    let selected: TreeNode = event.node;
    this.treeLoading = true;
    this.sectionService
      .query({
        parent_id: selected.data.id,
        columns: ['id', 'name', 'code', 'position'],
      })
      .subscribe(
        (resp) => {
          console.log(resp);
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

  onSelectionChange(event: any): void {
    const selection =
      typeof this.selectedValue === 'object'
        ? this.returnType === 'object'
          ? this.selectedValue?.data
          : this.selectedValue?.data?.id
        : this.selectedValue?.data?.map((d: Section) => {
            return this.returnType === 'object' ? d : d.id;
          });
    this.onSelect.next(selection);
  }
}
