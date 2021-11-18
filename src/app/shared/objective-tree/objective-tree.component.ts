/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { ObjectiveType } from 'src/app/setup/objective-type/objective-type.model';
import { ObjectiveTypeService } from 'src/app/setup/objective-type/objective-type.service';
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
export class ObjectiveTreeComponent implements OnInit, OnDestroy {
  currentUser!: User;

  @Input() sectorId!: Subject<number>;
  @Input() allSectors: boolean = false;
  @Input() selectionMode: string = 'single';
  @Input() returnType: string = 'id';
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onLoadingChange: EventEmitter<boolean> = new EventEmitter(false);

  objectiveNode?: TreeNode;
  objectives?: any[] = [];
  objectiveTypes?: ObjectiveType[] = [];
  lowestType?: ObjectiveType;
  subscription?: Subscription;

  constructor(
    protected userService: UserService,
    protected objectiveService: ObjectiveService,
    protected objectiveTypeService: ObjectiveTypeService
  ) {
    this.currentUser = userService.getCurrentUser();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.objectiveTypeService
      .query({
        columns: ['id', 'position', 'name'],
      })
      .subscribe((resp) => {
        this.objectiveTypes = resp.data || [];
        this.lowestType = this.objectiveTypes?.find(
          (t) => t.position === this.objectiveTypes?.length
        );
        this.allSectors && this.loadTree();
      });

    this.subscription = this.sectorId?.subscribe((sectorId) => {
      this.loadTree(sectorId);
      this.objectiveNode = undefined;
      this.onSelectionChange();
    });
    this.onLoadingChange.next(false);
  }

  loadTree(sectorId?: number): void {
    const sectorFilter = sectorId
      ? {
          sector_id: sectorId,
        }
      : {};
    this.objectiveService.tree(sectorFilter).subscribe(
      (resp: CustomResponse<Objective[]>) => {
        this.objectives = resp.data?.map((obj) => this.getNode(obj));
        this.onLoadingChange.next(false);
      },
      (error) => {
        this.onLoadingChange.next(false);
      }
    );
  }

  private getNode(ob: Objective): TreeNode {
    const hasChildren = ob.children?.length! > 0;
    return {
      label: `[ ${ob.code} ] - ${ob.description}`,
      data: ob,
      key: ob.id?.toString(),
      selectable: ob.objective_type_id === this.lowestType?.id,
      expanded: hasChildren,
      children: hasChildren ? ob.children?.map((cob) => this.getNode(cob)) : [],
    };
  }

  onSelectionChange(event?: any): void {
    const selection =
      typeof this.objectiveNode?.data === 'object'
        ? this.returnType === 'object'
          ? this.objectiveNode?.data
          : this.objectiveNode?.data?.id
        : this.objectiveNode?.data?.map((d: Objective) => {
            return this.returnType === 'object' ? d : d.id;
          });
    this.onSelect.next(selection);
  }
}
