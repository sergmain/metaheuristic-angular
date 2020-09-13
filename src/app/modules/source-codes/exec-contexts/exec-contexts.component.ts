import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogMethod } from '@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ExecContextState } from '@src/app/enums/ExecContextState';
import { ExecContext } from '@src/app/services/source-codes/ExecContext';
import { ExecContextsResult } from '@src/app/services/source-codes/ExecContextsResult';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';




@Component({
    selector: 'exec-contexts',
    templateUrl: './exec-contexts.component.html',
    styleUrls: ['./exec-contexts.component.scss']
})
export class ExecContextsComponent implements OnInit {
    readonly execState = ExecContextState;

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;

    sourceCodeId: string;
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

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private sourceCodesService: SourceCodesService,
    ) { }

    ngOnInit(): void {
        this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
        this.getExecContexts(0);
    }

    getExecContexts(page: number): void {
        this.sourceCodesService.execContexts.get(this.sourceCodeId, page.toString()).subscribe(v => {
            this.response = v;
            if (v) {
                this.execContextTableSource = new MatTableDataSource(v.instances.content);
                this.prevTable.disabled = v.instances.first;
                this.nextTable.disabled = v.instances.last;
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
        this.sourceCodesService.execContext
            .deleteCommit(this.sourceCodeId, execContext.id?.toString?.())
            .subscribe(v => this.getExecContexts(this.response.instances.number));
    }

    next(): void {
        this.getExecContexts(this.response.instances.number + 1);
    }

    prev(): void {
        this.getExecContexts(this.response.instances.number - 1);
    }

    runExecState(id, state): void {
        this.sourceCodesService.execContext
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
}