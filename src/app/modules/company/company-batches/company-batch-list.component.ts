import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@app/services/company/company.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BatchesResult } from '@app/services/batch/BatchesResult';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { ConfirmationDialogMethod, QuestionData } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '@app/services/authentication';
import * as fileSaver from 'file-saver';
import { BatchExecState } from '@app/enums/BatchExecState';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { SelectionModel } from '@angular/cdk/collections';
import { BatchData } from '@app/services/batch/BatchData';
import { BatchSelector } from '@app/services/batch/BatchSelector';
import { BatchService } from '@app/services/batch/batch.service';
import { NgIf, NgTemplateOutlet, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';





@Component({
    selector: 'company-batch-list',
    templateUrl: './company-batch-list.component.html',
    styleUrls: ['./company-batch-list.component.scss'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, NgTemplateOutlet, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCheckbox, MatCellDef, MatCell, MatButton, RouterLink, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, DatePipe, TranslateModule]
})
export class CompanyBatchListComponent extends UIStateComponent implements OnInit {
    companyUniqueId: string;
    batchesResult: BatchesResult;
    batches: BatchData.BatchExecInfo[];
    dataSource: MatTableDataSource<BatchData.BatchExecInfo> = new MatTableDataSource([]);
    selection: SelectionModel<BatchData.BatchExecInfo> = new SelectionModel<BatchData.BatchExecInfo>(true, []);

    downloadSelector: BatchSelector = new BatchSelector();

    constructor(
        readonly authenticationService: AuthenticationService,
        private companyService: CompanyService,
        private activatedRoute: ActivatedRoute,
        readonly dialog: MatDialog,
        readonly translate: TranslateService,
    ) {
        super(authenticationService);
    }

    checkAndToggleRowSeletion(batch: BatchData.BatchExecInfo): void {
        if (
            this.isFinished(batch) &&
            !this.isExecContextDeleted(batch)
        ) {
            this.downloadSelector.toggle(batch);
        }
    }

    ngOnInit(): void {
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.updateTable('0');
    }

    isAllSelected(): boolean {
        return this.selection.selected.length === this.dataSource.data.filter(b => b.batch.deleted).length;
    }

    masterToggle(): void {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.filter(b => b.batch.deleted).forEach(row => this.selection.select(row));
    }

    get columnsToDisplay(): string[] {
        if (this.isRole.MasterOperator) {
            return [
                'check',
                'id',
                'createdOn',
                'isBatchConsistent',
                'isDeleted',
                'sourceCode',
                'execState',
                'bts'
            ];
        } else {
            return ['id',
                'createdOn',
                'isBatchConsistent',
                'isDeleted',
                'sourceCode',
                'execState',
                'bts'
            ];
        }
    }

    updateTable(pageNumber: string): void {
        this.isLoading = true;
        this.companyService
            .batches(pageNumber, this.companyUniqueId)
            .subscribe({
                next: (batchesResult) => {
                    this.batchesResult = batchesResult;
                    this.batches = this.batchesResult.batches.content;
                    this.dataSource = new MatTableDataSource(this.batches);
                    this.selection.clear();
                },
                complete: () => this.isLoading = false,
            });
    }

    isFinished(b: BatchData.BatchExecInfo): boolean {
        if (b.batch.execState === BatchExecState.Finished ||
            b.batch.execState === BatchExecState.Error ||
            b.batch.execState === BatchExecState.Archived) {
            return true;
        }
        return false;
    }

    isExecContextDeleted(b: BatchData.BatchExecInfo): boolean {
        return b.execContextDeleted;
    }

    prevPage(): void {
        this.updateTable((this.batchesResult.batches.number - 1).toString());
    }

    nextPage(): void {
        this.updateTable((this.batchesResult.batches.number + 1).toString());
    }

    @ConfirmationDialogMethod({
        question: (batch: BatchData.BatchExecInfo): QuestionData => {
            return {
                text: marker('batch-company.delete-dialog.Do you want to delete Batch _batchId_'),
                params: { batchId: batch.batch.id }
            };
        },
        rejectTitle: `${marker('batch-company.delete-dialog.Cancel')}`,
        resolveTitle: `${marker('batch-company.delete-dialog.Delete')}`,
    })

    deleteOne(batch: BatchData.BatchExecInfo): void {
        this.isLoading = true;
        this.companyService
            .processBatchDeleteCommit(this.companyUniqueId, batch.batch.id.toString())
            .subscribe({
                complete: () => {
                    this.updateTable(this.batchesResult.batches.number.toString());
                }
            });
    }

    @ConfirmationDialogMethod({
        question: (): QuestionData => {
            return {
                text: marker('batch-company.delete-dialog.Do you want to delete Batches'),
                params: {}
            };
        },
        rejectTitle: `${marker('batch-company.delete-dialog.Cancel')}`,
        resolveTitle: `${marker('batch-company.delete-dialog.Delete')}`,
    })
    deleteMany(): void {
        this.isLoading = true;
        this.companyService
            .processBatchesBulkDeleteCommit(
                this.companyUniqueId,
                this.selection.selected
                    .map(b => b.batch.id).toString()
            )
            .subscribe({
                next: () => {
                    this.updateTable(this.batchesResult.batches.number.toString());
                }
            });
    }

    downloadResult(el: BatchData.BatchExecInfo): void {
        this.companyService
            .downloadProcessingResult(this.companyUniqueId, el.batch.id.toString())
            .subscribe((res) => {
                let contentDisposition = res.headers.get('Content-Disposition');
                const tryname: string = contentDisposition
                    .replace('filename*=UTF-8\'\'', '') || 'result.zip';
                console.log('company-batch-list.contentDisposition: ' + contentDisposition);
                console.log('company-batch-list.tryname: ' + tryname);
                const decodedName = decodeURI(tryname);
                console.log('company-batch-list.decodedName: ' + decodedName);
                fileSaver.saveAs(res.body, decodedName);
            });
    }
    downloadOriginFile(el: BatchData.BatchExecInfo): void {
        this.companyService
            .downloadOriginFile(
                this.companyUniqueId,
                el.batch.id.toString(),
                el.uploadedFileName
            )
            .subscribe((res) => {
                const name: string = res.headers
                    .get('Content-Disposition')
                    .replace('filename*=UTF-8\'\'', '') || 'result.zip';
                console.log('company-batchs: ' + name);
                fileSaver.saveAs(res.body, name);
            });
    }

    downloadResults(): void {
        this.isLoading = true;
        this.companyService.downloadProcessingResults(
            this.downloadSelector.getList(),
            this.companyUniqueId
        ).subscribe(() => {
            this.isLoading = false;
            this.downloadSelector.clear();
        });
    }
}
