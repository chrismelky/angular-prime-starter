/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Objective } from 'src/app/setup/objective/objective.model';
import { ObjectiveService } from 'src/app/setup/objective/objective.service';
import { User } from 'src/app/setup/user/user.model';
import { UserService } from 'src/app/setup/user/user.service';
import { CustomResponse } from 'src/app/utils/custom-response';

@Component({
  selector: 'app-objective-tree',
  templateUrl: './objective-tree.component.html',
  styleUrls: ['./objective-tree.component.scss'],
})
export class ObjectiveTreeComponent implements OnInit {
  currentUser!: User;

  @Input() selectionMode: string = 'single';
  @Input() returnType: string = 'id';
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  objectiveNode!: TreeNode;
  objectives?: any[] = [];

  constructor(
    protected userService: UserService,
    protected objectiveService: ObjectiveService
  ) {
    this.currentUser = userService.getCurrentUser();
  }

  ngOnInit(): void {
    this.objectiveService
      .tree()
      .subscribe(
        (resp: CustomResponse<Objective[]>) =>
          (this.objectives = resp.data?.map((obj) => this.getNode(obj)))
      );
  }

  private getNode(ob: Objective): TreeNode {
    const hasChildren = ob.children?.length! > 0;
    return {
      label: `[ ${ob.code} ] - ${ob.description}`,
      data: ob,
      key: ob.id?.toString(),
      selectable: !hasChildren,
      expanded: hasChildren,
      children: hasChildren ? ob.children?.map((cob) => this.getNode(cob)) : [],
    };
  }

  onSelectionChange(event?: any): void {
    const selection =
      typeof this.objectiveNode.data === 'object'
        ? this.returnType === 'object'
          ? this.objectiveNode?.data
          : this.objectiveNode?.data?.id
        : this.objectiveNode?.data?.map((d: Objective) => {
            return this.returnType === 'object' ? d : d.id;
          });
    this.onSelect.next(selection);
  }
}
