import { Component, OnInit, TemplateRef, input, viewChild, inject, signal } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { TaskExecState } from '@app/enums/TaskExecState';
import { ExecContextService } from '@app/services/exec-context/exec-context.service';
import { TaskExecInfo } from '@app/services/exec-context/TaskExecInfo';
import { ExecContextStateResult } from '@app/services/source-codes/ExecContextStateResult';
import * as fileSaver from 'file-saver';
import {ConfirmationDialogMethod} from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import {MhUtils} from '@services/mh-utils/mh-utils.service';
import { NgTemplateOutlet } from '@angular/common';
import { CtSectionComponent } from '../ct-section/ct-section.component';
import { CtSectionBodyComponent } from '../ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../ct-section-body-row/ct-section-body-row.component';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CtPreComponent } from '../ct-pre/ct-pre.component';

@Component({
    standalone : true,
    selector: 'ct-state-of-tasks',
    templateUrl: './ct-state-of-tasks.component.html',
    styleUrls: ['./ct-state-of-tasks.component.scss'],
    imports: [CtSectionComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, MatIconButton, MatTooltip, MatIcon, NgTemplateOutlet, CdkScrollable, MatDialogContent, CtPreComponent, MatDialogActions, MatButton, MatDialogClose]
})
export class CtStateOfTasksComponent implements OnInit {
      private execContextService = inject(ExecContextService);
      public readonly dialog = inject(MatDialog);
  errorDialogTemplate = viewChild<TemplateRef<any>>('errorDialogTemplate');
  sourceCodeId = input<string>();
  execContextId = input<string>();

  response = signal<ExecContextStateResult | undefined>(undefined);
  taskExecInfo = signal<TaskExecInfo | undefined>(undefined);
  readonly TaskExecState: { [value: string]: string } = TaskExecState;

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    if (this.sourceCodeId() && this.execContextId()) {
      this.execContextService
          .execContextsState(this.sourceCodeId(), this.execContextId())
          .subscribe(response => {
            this.response.set(response);
          });
    }
  }

  openError(taskId: string): void {
    this.taskExecInfo.set(null);
    this.dialog.open(this.errorDialogTemplate(), {
      width: '100%'
    });
    this.execContextService
        .taskExecInfo(this.sourceCodeId(), this.execContextId(), taskId)
        .subscribe(taskExecInfo => {
          this.taskExecInfo.set(taskExecInfo);
        });

  }

  downloadFile(out: {
    ctx: string;
    e: any;
    i: boolean;
    id: number;
    n: boolean;
    nm: string;
  }): void {
    console.log('Start downloading file');
    this.execContextService
        .downloadVariable(this.execContextId(), out.id.toString())
        .subscribe(response => {
            MhUtils.printHeaders(response.headers);
            let contentDisposition = response.headers.get('Content-Disposition');
            const tryName: string = contentDisposition?.split?.('\'\'')?.[1];
            const decodedName = tryName ? decodeURI(tryName) : tryName;
            // console.log('batch-list.contentDisposition: ' + contentDisposition);
            // console.log('batch-list.tryName: ' + tryName);
            // console.log('batch-list.decodedName: ' + decodedName);

            // const name: string = response.headers.get('Content-Disposition').split('\'\'')[1];
            // console.log('state-of-tasks: ' + name);

            // fileSaver.saveAs(response.body, name);
            fileSaver.saveAs(response.body, decodedName ? decodedName : 'file.bin');
        });
  }

  @ConfirmationDialogMethod({
    question: (taskId: number): string => `Do you want to clear Cache for Task #${taskId}`,
    resolveTitle: 'Clear Cache',
    rejectTitle: 'Cancel',
    theme: 'warn'
  })
  clearCache(taskId: number): void {
    this.execContextService
        .clearCache(taskId.toString())
        .subscribe(v => {
          //
        });
  }
}
