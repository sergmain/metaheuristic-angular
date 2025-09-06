import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskExecState } from '@src/app/enums/TaskExecState';
import { ExecContextService } from '@src/app/services/exec-context/exec-context.service';
import { TaskExecInfo } from '@src/app/services/exec-context/TaskExecInfo';
import { ExecContextStateResult } from '@src/app/services/source-codes/ExecContextStateResult';
import * as fileSaver from 'file-saver';
import {ConfirmationDialogMethod} from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import {MhUtils} from '@services/mh-utils/mh-utils.service';

@Component({
    selector: 'ct-state-of-tasks',
    templateUrl: './ct-state-of-tasks.component.html',
    styleUrls: ['./ct-state-of-tasks.component.scss'],
    standalone: false
})
export class CtStateOfTasksComponent implements OnInit {
  @ViewChild('errorDialogTemplate') errorDialogTemplate: TemplateRef<any>;
  @Input() sourceCodeId: string;
  @Input() execContextId: string;

  response: ExecContextStateResult;
  taskExecInfo: TaskExecInfo;
  readonly TaskExecState: { [value: string]: string } = TaskExecState;

  constructor(
      private execContextService: ExecContextService,
      readonly dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    if (this.sourceCodeId && this.execContextId) {
      this.execContextService
          .execContextsState(this.sourceCodeId, this.execContextId)
          .subscribe(response => {
            this.response = response;
          });
    }
  }

  openError(taskId: string): void {
    this.taskExecInfo = null;
    this.dialog.open(this.errorDialogTemplate, {
      width: '100%'
    });
    this.execContextService
        .taskExecInfo(this.sourceCodeId, this.execContextId, taskId)
        .subscribe(taskExecInfo => {
          this.taskExecInfo = taskExecInfo;
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
        .downloadVariable(this.execContextId, out.id.toString())
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
