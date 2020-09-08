import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogMethod, QuestionData } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { BatchService } from '@app/services/batch/batch.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@src/app/app.reducers';
import { CtTableComponent } from '@src/app/modules/ct/ct-table/ct-table.component';
import { AuthenticationService } from '@src/app/services/authentication/authentication.service';
import { Batch } from '@src/app/services/batch/Batch';
import { getBatches } from '@src/app/services/batch/batch.actions';
import { BatchesState } from '@src/app/services/batch/BatchesState';
import { toggleFilterBatches } from '@src/app/services/settings/settings.actions';
import * as fileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { Role } from '@src/app/services/authentication';
import { MatTableDataSource } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'batch',
    templateUrl: './batch.component.html',
    styleUrls: ['./batch.component.scss']
})
export class BatchComponent implements OnInit, OnDestroy {
    storeSubscriber: Subscription;
    batches: BatchesState;

    dataSource = new MatTableDataSource<Batch>([]);
    columnsToDisplay = ['id', 'createdOn', 'isBatchConsistent', 'sourceCode', 'execState', 'bts'];

    deletedRows: Batch[] = [];

    fileSystemName: string;
    classpathFileName: string;

    isFilterBatches: boolean;

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('table', { static: true }) table: CtTableComponent;

    constructor(
        private translate: TranslateService,
        private dialog: MatDialog,
        private batchService: BatchService,
        private authenticationService: AuthenticationService,
        private store: Store<AppState>
    ) {

    }

    ngOnInit() {
        this.storeSubscriber = this.store.subscribe((state: AppState) => {
            this.isFilterBatches = state.settings.filterBatches;
            this.batches = state.batches;
            this.updateTable();
        });

        this.store.dispatch(getBatches({
            page: 0,
            filterBatches: this.isFilterBatches
        }));
    }

    ngOnDestroy() {
        if (this.storeSubscriber) {
            this.storeSubscriber.unsubscribe();
        }
    }

    toggleFilterBatches() {
        this.store.dispatch(toggleFilterBatches({ payload: !this.isFilterBatches }));
        this.store.dispatch(getBatches({
            page: 0,
            filterBatches: this.isFilterBatches
        }));
    }

    updateTable() {
        this.batches.isLoading !== true ? this.table.show() : this.table.wait();
        if (this.batches.response) {
            if (this.authenticationService.getUserRole().has(Role.ROLE_OPERATOR)) {
                this.columnsToDisplay = ['id', 'createdOn', 'sourceCode', 'execState', 'bts'];
            } else {
                this.columnsToDisplay = ['id', 'createdOn', 'isBatchConsistent', 'sourceCode', 'execState', 'bts'];
            }
            this.dataSource = new MatTableDataSource(this.batches.response.batches.content || []);
            this.prevTable.disabled = this.batches.response.batches.first;
            this.nextTable.disabled = this.batches.response.batches.last;
        }
    }

    downloadFile(batchId: string) {
        this.batchService.downloadFile(batchId)
            .subscribe((res: HttpResponse<any>) => {
                let filename: string = 'result.zip';
                try {
                    filename = res.headers.get('Content-Disposition').split('\'\'')[1];
                } catch (e) {
                    console.log(e);
                }
                this._saveFile(res.body, decodeURIComponent(filename));
            });
    }

    private _saveFile(data: any, filename?: string) {
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
            .deleteCommit(batch.batch.id.toString())
            .subscribe();
    }

    next() {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.store.dispatch(getBatches({
            page: this.batches.response.batches.number + 1,
            filterBatches: this.isFilterBatches
        }));
    }

    prev() {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.store.dispatch(getBatches({
            page: this.batches.response.batches.number - 1,
            filterBatches: this.isFilterBatches
        }));
    }
}