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
    this.objectiveService.tree().subscribe(
      (resp: CustomResponse<Objective[]>) =>
        (this.objectives = resp.data?.map((obj) => {
          return {
            label: `[ ${obj.code} ] - ${obj.description}`,
            data: obj,
            selectable: false, //TODO make configurable
            expanded: true,
            key: obj.id,
            children: obj.children?.map((obj2) => {
              return {
                label: `[ ${obj2.code} ] - ${obj2.description}`,
                data: obj2,
                key: obj2.id,
              };
            }),
          };
        }))
    );
  }

  onSelectionChange(event?: any): void {
    console.log(event);
    console.log(this.objectiveNode);
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
