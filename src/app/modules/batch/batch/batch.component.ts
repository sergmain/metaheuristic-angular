import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogMethod, QuestionData } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { BatchService } from '@app/services/batch/batch.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@src/app/app.reducers';
import { CtTableComponent } from '@src/app/modules/ct/ct-table/ct-table.component';
import { Role } from '@src/app/services/authentication';
import { AuthenticationService } from '@src/app/services/authentication/authentication.service';
import { getBatches } from '@src/app/services/batch/batch.actions';
import { BatchData } from '@src/app/services/batch/BatchData';
import { BatchesState } from '@src/app/services/batch/BatchesState';
import { toggleFilterBatches } from '@src/app/services/settings/settings.actions';
import * as fileSaver from 'file-saver';
import { Subscription } from 'rxjs';

@Component({
    selector: 'batch',
    templateUrl: './batch.component.html',
    styleUrls: ['./batch.component.scss']
})
export class BatchComponent implements OnInit, OnDestroy {
    subs: Subscription[] = [];
    batches: BatchesState;

    dataSource: MatTableDataSource<BatchData.BatchExecInfo> = new MatTableDataSource<BatchData.BatchExecInfo>([]);
    columnsToDisplay: string[] = ['id', 'createdOn', 'Owner', 'isBatchConsistent', 'sourceCode', 'execState', 'bts'];

    deletedRows: BatchData.BatchExecInfo[] = [];

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
        private store: Store<AppState>,
        private changeDetector: ChangeDetectorRef
    ) {

    }

    ngOnInit(): void {
        this.subs.push(this.store.subscribe((state: AppState) => {
            this.isFilterBatches = state.settings.filterBatches;
            this.batches = state.batches;
            this.updateTable();
        }));

        this.store.dispatch(getBatches({
            page: 0,
            filterBatches: this.isFilterBatches
        }));
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    toggleFilterBatches(): void {
        this.store.dispatch(toggleFilterBatches({ payload: !this.isFilterBatches }));
        this.store.dispatch(getBatches({
            page: 0,
            filterBatches: this.isFilterBatches
        }));
    }

    updateTable(): void {
        this.batches.isLoading !== true ? this.table.show() : this.table.wait();
        if (this.batches.response) {
            if (this.authenticationService.getUserRole().has(Role.ROLE_OPERATOR)) {
                this.columnsToDisplay = ['id', 'createdOn', 'Owner', 'sourceCode', 'execState', 'bts'];
            } else {
                this.columnsToDisplay = ['id', 'createdOn', 'Owner', 'isBatchConsistent', 'sourceCode', 'execState', 'bts'];
            }
            this.dataSource = new MatTableDataSource(this.batches.list || []);
            this.prevTable.disabled = this.batches.response.batches.first;
            this.nextTable.disabled = this.batches.response.batches.last;
        }
    }

    isDeleted(b: BatchData.BatchExecInfo): boolean {
        return !!this.deletedRows.filter(db => db.batch.id === b.batch.id).length;
    }

    downloadFile(batchId: string): void {
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

    private _saveFile(data: any, filename?: string): void {
        const blob: Blob = new Blob([data], { type: 'application/octet-stream' });
        fileSaver.saveAs(blob, filename);
    }

    @ConfirmationDialogMethod({
        question: (batch: BatchData.BatchExecInfo): QuestionData => {
            return {
                text: marker('batch.delete-dialog.Do you want to delete Batch _batchId_'),
                params: { batchId: batch.batch.id }
            };
        },
        rejectTitle: `${marker('batch.delete-dialog.Cancel')}`,
        resolveTitle: `${marker('batch.delete-dialog.Delete')}`,
    })
    delete(batch: BatchData.BatchExecInfo): void {
        this.deletedRows.push(batch);
        this.batchService
            .processResourceDeleteCommit(batch.batch.id.toString())
            .subscribe();
    }

    next(): void {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.store.dispatch(getBatches({
            page: this.batches.response.batches.number + 1,
            filterBatches: this.isFilterBatches
        }));
    }

    prev(): void {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.store.dispatch(getBatches({
            page: this.batches.response.batches.number - 1,
            filterBatches: this.isFilterBatches
        }));
    }
}