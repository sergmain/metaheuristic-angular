import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatDialog, MatTableDataSource } from '@angular/material';
import { ConfirmationDialogMethod, QuestionData } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
import { Batch, batches, BatchService } from '@app/services/batch/batch.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { CtTableComponent } from '@src/app/ct/ct-table/ct-table.component';
import { Role } from '@src/app/services/authentication';
import { AuthenticationService } from '@src/app/services/authentication/authentication.service';
import * as fileSaver from 'file-saver';


@Component({
    selector: 'batch',
    templateUrl: './batch.component.html',
    styleUrls: ['./batch.component.scss']
})

export class BatchComponent implements OnInit {
    states = LoadStates;
    currentStates = new Set();

    response: batches.get.Response;
    dataSource = new MatTableDataSource < Batch > ([]);
    columnsToDisplay = ['id', 'createdOn', 'isBatchConsistent', 'planCode', 'execState', 'bts'];

    deletedRows: Batch[] = [];

    fileSystemName: string;
    classpathFileName: string;

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('table', { static: true }) table: CtTableComponent;

    constructor(
        private translate: TranslateService,
        private dialog: MatDialog,
        private batchService: BatchService,
        private authenticationService: AuthenticationService,
    ) {}

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.updateTable(0);
    }

    updateTable(page: number) {
        this.currentStates.add(this.states.loading);
        this.batchService.batches.get(page)
            .subscribe(
                (response: batches.get.Response) => {

                    // bug 704
                    if (this.authenticationService.getUserRole().has(Role.Operator)) {
                        this.columnsToDisplay = ['id', 'createdOn', 'planCode', 'execState', 'bts'];
                    } else {
                        this.columnsToDisplay = ['id', 'createdOn', 'isBatchConsistent', 'planCode', 'execState', 'bts'];
                    }

                    this.response = response;
                    this.dataSource = new MatTableDataSource(response.batches.content || []);
                    this.table.show();

                    this.currentStates.delete(this.states.firstLoading);
                    this.currentStates.delete(this.states.loading);
                    this.prevTable.disabled = this.response.batches.first;
                    this.nextTable.disabled = this.response.batches.last;
                }
            );
    }

    downloadFile(batchId: string) {
        this.batchService.downloadFile(batchId)
            .subscribe((res: HttpResponse < any > ) => {
                let filename: string = 'result.zip';
                try {
                    filename = res.headers.get('Content-Disposition').split('\'\'')[1];
                } catch (e) {
                    console.log(e);
                }
                this._saveFile(res.body, decodeURIComponent(filename));
            });
    }


    private _saveFile(data: any, filename ? : string) {
        const blob: Blob = new Blob([data], { type: 'application/octet-stream' });
        fileSaver.saveAs(blob, filename);
    }



    @ConfirmationDialogMethod({
        question: (batch: Batch): QuestionData => {
            return {
                text: marker('batch.delete-dialog.Do you want to delete Batch _batchId_'),
                params: { batchId: batch.batch.id }
            };
        },
        rejectTitle: `${marker('batch.delete-dialog.Cancel')}`,
        resolveTitle: `${marker('batch.delete-dialog.Delete')}`,
    })
    delete(batch: Batch) {
        this.deletedRows.push(batch);
        this.batchService.batch
            .deleteCommit(batch.batch.id)
            .subscribe();
    }

    next() {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.response.batches.number + 1);
    }

    prev() {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.response.batches.number - 1);
    }
}