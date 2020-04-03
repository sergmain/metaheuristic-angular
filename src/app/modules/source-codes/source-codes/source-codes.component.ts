import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatDialog, MatTabGroup, MatTableDataSource } from '@angular/material';
import { ConfirmationDialogInterface, ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
import { SourceCode } from '@src/app/services/source-codes/SourceCode';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { SourceCodesArchiveComponent } from '../source-codes-archive/source-codes-archive.component';

@Component({
    selector: 'source-codes',
    templateUrl: './source-codes.component.html',
    styleUrls: ['./source-codes.component.sass']
})

export class SourceCodesComponent implements OnInit, ConfirmationDialogInterface {
    TABINDEX: number = 0;

    states = LoadStates;
    currentStates = new Set();
    response;
    dataSource = new MatTableDataSource<SourceCode>([]);
    columnsToDisplay = ['id', 'uid', 'createdOn', 'valid', 'locked', 'bts'];
    deletedSourceCodes: SourceCode[] = [];
    archivedSourceCodes: SourceCode[] = [];

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('matTabGroup', { static: true }) matTabGroup: MatTabGroup;
    @ViewChild('table', { static: true }) table: CtTableComponent;
    @ViewChild('sourceCodesArchive', { static: true }) sourceCodesArchive: SourceCodesArchiveComponent;

    constructor(
        readonly dialog: MatDialog,
        private sourceCodesService: SourceCodesService
    ) { }

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.updateTable(0);

    }

    updateTable(page: number) {
        this.currentStates.add(this.states.loading);
        this.sourceCodesService.sourceCodes
            .get(page.toString())
            .subscribe(response => {
                this.response = response;
                this.dataSource = new MatTableDataSource(response.items.content || []);
                this.table.show();
                this.currentStates.delete(this.states.firstLoading);
                this.currentStates.delete(this.states.loading);
                this.prevTable.disabled = this.response.items.first;
                this.nextTable.disabled = this.response.items.last;
            });
    }

    @ConfirmationDialogMethod({
        question: (sourceCode: SourceCode): string =>
            `Do you want to delete SourceCode\xa0#${sourceCode.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(sourceCode: SourceCode) {
        this.deletedSourceCodes.push(sourceCode);
        this.sourceCodesService.sourceCode
            .delete(sourceCode.id.toString())
            .subscribe();
    }

    @ConfirmationDialogMethod({
        question: (sourceCode: SourceCode): string =>
            `Do you want to archive SourceCode\xa0#${sourceCode.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Archive'
    })
    archive(sourceCode: SourceCode) {
        this.archivedSourceCodes.push(sourceCode);
        this.sourceCodesService.sourceCode
            .archive(sourceCode.id.toString())
            .subscribe();
    }

    tabChange() {
        if (this.matTabGroup.selectedIndex === 1) {
            this.sourceCodesArchive.updateTable(0)
        }
    }

    next() {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.response.items.number + 1);
    }

    prev() {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.response.items.number - 1);
    }
}