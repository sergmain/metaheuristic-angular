import {Component, Input, NgModule, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import { ConfirmationDialogMethod } from '@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ExecContextState } from '@src/app/enums/ExecContextState';
import { ExecContextService } from '@src/app/services/exec-context/exec-context.service';
import { ExecContext } from '@src/app/services/source-codes/ExecContext';
import { ExecContextsResult } from '@src/app/services/source-codes/ExecContextsResult';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';


@Component({
    selector: 'ct-exec-contexts',
    templateUrl: './ct-exec-contexts.component.html',
    styleUrls: ['./ct-exec-contexts.component.scss']
})
export class CtExecContextsComponent implements OnInit {
    @ViewChild('stateOfTasksTemplate') stateOfTasksTemplate: TemplateRef<any>;
    @ViewChild('errorDialogTemplate') errorDialogTemplate: TemplateRef<any>;

    @Input() sourceCodeId: string;
    @Input() modal: boolean;

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;

    readonly execState = ExecContextState;

    response: ExecContextsResult;
    execContextTableSource: MatTableDataSource<ExecContext> = new MatTableDataSource<ExecContext>([]);
    execContextColumnsToDisplay: string[] = [
        'id',
        'createdOn',
        'isExecContextValid',
        'execState',
        'completedOn',
        'bts'
    ];

    execContextId: string;

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private execContextService: ExecContextService,
        private sourceCodesService: SourceCodesService,
        private router: Router
    ) {

    }

    ngOnInit(): void {
        // this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
        this.getExecContexts(0);
    }

    getExecContexts(page: number): void {
        this.execContextService
            .execContexts(this.sourceCodeId, page.toString())
            .subscribe(execContextsResult => {
                this.response = execContextsResult;
                if (execContextsResult) {
                    this.execContextTableSource = new MatTableDataSource(execContextsResult.instances.content);
                    this.prevTable.disabled = execContextsResult.instances.first;
                    this.nextTable.disabled = execContextsResult.instances.last;
                }
            });
    }

    @ConfirmationDialogMethod({
        question: (execContext: ExecContext): string =>
            `Do you want to delete ExecContext\xa0#${execContext.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(execContext: ExecContext): void {
        this.execContextService
            .execContextDeleteCommit(this.sourceCodeId, execContext.id?.toString?.())
            .subscribe(v => this.getExecContexts(this.response.instances.number));
    }

    next(): void {
        this.getExecContexts(this.response.instances.number + 1);
    }

    prev(): void {
        this.getExecContexts(this.response.instances.number - 1);
    }

    runExecState(id, state): void {
        this.execContextService
            .execContextTargetState(this.sourceCodeId, state, id)
            .subscribe(v => this.getExecContexts(this.response.instances.number));
    }

    stop(el, event): void {
        event.target.disabled = true;
        this.runExecState(el.id, 'STOPPED');
    }

    start(el, event): void {
        event.target.disabled = true;
        this.runExecState(el.id, 'STARTED');
    }

    produce(el, event): void {
        event.target.disabled = true;
        this.runExecState(el.id, 'PRODUCING');
    }


    stateOfTasks(el) {
        this.dialog.closeAll();
        this.execContextId = el.id;
        this.dialog.open(this.stateOfTasksTemplate, {
            width: '90%'
        });
    }
}