import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(protected messageService: MessageService) {}

  info(summary: string): void {
    this.messageService.add({ key: 'info', severity: 'info', summary });
  }

  warn(summary: string): void {
    this.messageService.add({ key: 'info', severity: 'warn', summary });
  }

  error(summary: string, detail?: any) {
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary,
      sticky: true,
      detail: detail ? `${JSON.stringify(detail).substr(0, 100)}...` : '',
    });
  }
}
