import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, } from '@angular/material/dialog';
import { MatButton, } from '@angular/material/button';

import { ActivatedRoute } from '@angular/router';
import { WorkbookExecState } from '@app/enums/WorkbookExecState';
import { ConfirmationDialogMethod } from '@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ExecContext } from '@src/app/services/source-codes/ExecContext';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';


@Component({
    selector: 'exec-contexts',
    templateUrl: './exec-contexts.component.html',
    styleUrls: ['./exec-contexts.component.scss']
})
export class ExecContextsComponent implements OnInit {
    readonly execState = WorkbookExecState;

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;

    sourceCodeId: string;
    response;
    workbooksTableSource = new MatTableDataSource<ExecContext>([]);
    workbooksColumnsToDisplay = [
        'id',
        'planCode',
        'inputResourceParam',
        'createdOn',
        'isPlanValid',
        'isWorkbookValid',
        'execState',
        'completedOn',
        'bts'
    ];

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private sourceCodesService: SourceCodesService,
    ) { }

    ngOnInit() {
        this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
        this.getExecContexts(0);
    }

    getExecContexts(page: number) {
        this.sourceCodesService.execContexts.get(this.sourceCodeId, page.toString()).subscribe(v => {
            this.response = v;
            this.prevTable.disabled = v.instances.first;
            this.nextTable.disabled = v.instances.last;
        });
    }



    @ConfirmationDialogMethod({
        question: (execContext: ExecContext): string =>
            `Do you want to delete Workbook\xa0#${execContext.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(execContext: ExecContext) {
        this.sourceCodesService.execContext
            .deleteCommit(this.sourceCodeId, execContext.id)
            .subscribe(v => this.getExecContexts(this.response.instances.number))
    }

    next() {
        this.getExecContexts(this.response.instances.number + 1);
    }

    prev() {
        this.getExecContexts(this.response.instances.number - 1);
    }

    runExecState(id, state) {
        this.sourceCodesService.execContext
            .targetExecState(this.sourceCodeId, state, id)
            .subscribe(v => this.getExecContexts(this.response.instances.number));
    }

    stop(el, event) {
        event.target.disabled = true;
        this.runExecState(el.id, 'STOPPED');
    }

    start(el, event) {
        event.target.disabled = true;
        this.runExecState(el.id, 'STARTED');
    }

    produce(el, event) {
        event.target.disabled = true;
        this.runExecState(el.id, 'PRODUCED');
    }
}