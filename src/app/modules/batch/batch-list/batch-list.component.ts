import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogMethod, QuestionData } from '@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { BatchExecState } from '@src/app/enums/BatchExecState';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import { BatchService } from '@src/app/services/batch/batch.service';
import { BatchData } from '@src/app/services/batch/BatchData';
import { BatchesResult } from '@src/app/services/batch/BatchesResult';
import { BatchExecStatusService } from '@src/app/services/batch/BatchExecStatusService';
import { SettingsService } from '@src/app/services/settings/settings.service';
import * as fileSaver from 'file-saver';
import {MhUtils} from '@services/mh-utils/mh-utils.service';


@Component({
    selector: 'batch-list',
    templateUrl: './batch-list.component.html',
    styleUrls: ['./batch-list.component.scss']
})
export class BatchListComponent extends UIStateComponent implements OnInit, OnDestroy {
    batchesResult: BatchesResult;
    isFiltered: boolean;
    dataSource: MatTableDataSource<BatchData.BatchExecInfo> = new MatTableDataSource([]);
    columnsToDisplay: string[] = ['id', 'createdOn', 'Owner', 'isBatchConsistent', 'sourceCode', 'execState', 'bts'];

    constructor(
        private batchService: BatchService,
        readonly authenticationService: AuthenticationService,
        readonly dialog: MatDialog,
        readonly translate: TranslateService,
        private batchExexStatusService: BatchExecStatusService,
        private settingsService: SettingsService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.isFiltered = this.settingsService.events.value.settings.batchFilter;
        this.updateTable('0', this.isFiltered);
        this.subscribeSubscription(this.batchExexStatusService.getStatuses.subscribe({
            next: statuses => {
                this.batchExexStatusService.updateBatchesResultByStatuses(this.batchesResult, statuses);
            }
        }));
    }

    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }

    updateTable(pageNumbder: string, isFiltered: boolean): void {
        this.isLoading = true;
        this.batchService
            .batches(pageNumbder, isFiltered)
            .subscribe({
                next: batchesResult => {
                    this.batchesResult = batchesResult;
                    this.columnsToDisplay = this.authenticationService.isRoleOperator() ?
                        ['id', 'createdOn', 'Owner', 'sourceCode', 'execState', 'bts'] :
                        ['id', 'createdOn', 'Owner', 'isBatchConsistent', 'sourceCode', 'execState', 'bts'];
                    this.dataSource = new MatTableDataSource(batchesResult.batches.content || []);
                    this.isLoading = false;
                }
            });
    }

    toggleFilter(): void {
        this.isFiltered = !this.isFiltered;
        this.settingsService.toggleBatchFilter(this.isFiltered);
        this.updateTable('0', this.isFiltered);
    }

    isDeletedRow(b: BatchData.BatchExecInfo): boolean {
        return false;
    }

    @ConfirmationDialogMethod({
        question: (event: Event, batchData: BatchData.BatchExecInfo): QuestionData => {
            event.stopPropagation();
            return {
                text: marker('batch.delete-dialog.Do you want to delete Batch _batchId_'),
                params: { batchId: batchData.batch.id }
            };
        },
        rejectTitle: `${marker('batch.delete-dialog.Cancel')}`,
        resolveTitle: `${marker('batch.delete-dialog.Delete')}`,
    })
    delete(event: Event, batchData: BatchData.BatchExecInfo): void {
        this.batchService
            .processResourceDeleteCommit(batchData.batch.id.toString())
            .subscribe({
                next: () => {
                    this.updateTable((this.batchesResult.batches.number).toString(), this.isFiltered);
                }
            });
    }

    downloadFile(event: Event, batchId: string): void {
        event.stopPropagation();
        this.batchService.downloadFile(batchId)
            .subscribe((res: HttpResponse<Blob>) => {
                // MhUtils.printHeaders(res.headers);
                // console.log('batch-list.contentDispositionFilename: ' + MhUtils.parseContentDisposition(res.headers, 'result.zip'));

                let contentDisposition = res.headers.get('Content-Disposition');
                const tryName: string = contentDisposition?.split?.('\'\'')?.[1];
                const decodedName = tryName ? decodeURI(tryName) : tryName;
                // console.log('batch-list.contentDisposition: ' + contentDisposition);
                // console.log('batch-list.tryName: ' + tryName);
                // console.log('batch-list.decodedName: ' + decodedName);

                fileSaver.saveAs(res.body, decodedName ? decodedName : 'result.zip');
            });
    }

    downloadSelectedRows(): void {
        this.batchService.batchDownloader.download();
    }

    discardSelectedRows(): void {
        this.batchService.batchDownloader.clear();
    }

    isSelectedRow(batchData: BatchData.BatchExecInfo): boolean {
        return this.batchService.batchDownloader.isSelected(batchData);
    }

    selectRow(event: Event, batchData: BatchData.BatchExecInfo): void {
        event.stopPropagation();
        if (batchData.ok &&
            batchData.execState === BatchExecState.Finished) {
            this.batchService.batchDownloader.toggle(batchData);
        }
    }

    countOfSelectedRows(): number {
        return this.batchService.batchDownloader.size;
    }

    nextPage(): void {
        this.updateTable((this.batchesResult.batches.number + 1).toString(), this.isFiltered);
    }

    prevPage(): void {
        this.updateTable((this.batchesResult.batches.number - 1).toString(), this.isFiltered);
    }
}
