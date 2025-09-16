import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'confirmation-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatButton, TranslateModule],
  template: `
    <div mat-dialog-content>
      <h2>{{data.title}}</h2>
      <p>{{data.message}}</p>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="onCancel()">{{data.cancelText}}</button>
      <button mat-flat-button [color]="data.confirmColor || 'primary'" (click)="onConfirm()">
        {{data.confirmText}}
      </button>
    </div>
  `,
  styles: [`
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 0 0 0;
    }
    
    h2 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 500;
    }
    
    p {
      margin: 0 0 16px 0;
      color: rgba(0, 0, 0, 0.6);
    }
    
    :host-context(.dark-theme) p {
      color: rgba(255, 255, 255, 0.6);
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
