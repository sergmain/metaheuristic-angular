import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskExecState } from '@src/app/enums/TaskExecState';
import { ExecContextService } from '@src/app/services/exec-context/exec-context.service';
import { TaskExecInfo } from '@src/app/services/exec-context/TaskExecInfo';
import { ExecContextStateResult } from '@src/app/services/source-codes/ExecContextStateResult';
import * as fileSaver from 'file-saver';


@Component({
    selector: 'state-of-tasks',
    templateUrl: './state-of-tasks.component.html',
    styleUrls: ['./state-of-tasks.component.scss']
})
export class StateOfTasksComponent implements OnInit {
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
            width: '90%'
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
        this.execContextService
            .downloadVariable(this.execContextId, out.id.toString())
            .subscribe(response => {
                const name: string = response.headers
                    .get('Content-Disposition').split('\'\'')[1];
                console.log('state-of-tasks: ' + name);

                fileSaver.saveAs(response.body, name);
            });
    }
}
