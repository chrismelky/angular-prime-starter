import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Comment } from 'src/app/planning/scrutinization/comment/comment.model';
import { ScrutinizationService } from 'src/app/planning/scrutinization/scrutinization.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-address-comment',
  templateUrl: './address-comment.component.html',
  styleUrls: ['./address-comment.component.scss'],
})
export class AddressCommentComponent implements OnInit {
  comments?: Comment[] = [];
  unAddressedComments?: Comment[] = [];

  constructor(
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected scrutinyService: ScrutinizationService,
    protected toastr: ToastService
  ) {}

  ngOnInit(): void {
    this.comments = this.dialogConfig.data;
  }

  address(c: Comment): void {
    this.scrutinyService.addressComment(c).subscribe((resp) => {
      this.unAddressedComments = resp.data;
      this.comments = this.unAddressedComments;
      if (this.unAddressedComments?.length === 0) {
        this.done();
      }
      this.toastr.info('Comment addressed');
    });
  }

  done(): void {
    this.dialogRef.close(this.unAddressedComments);
  }
}
