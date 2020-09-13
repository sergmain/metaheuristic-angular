import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@src/app/services/company/company.service';
import { ActivatedRoute } from '@angular/router';
import { BatchesResult } from '@src/app/services/batch/BatchesResult';
import { MatTableDataSource } from '@angular/material/table';
import { Batch } from '@src/app/services/batch/Batch';
import { UIBatch } from '@src/app/services/batch/UIBatch';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { ConfirmationDialogMethod, QuestionData } from '@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '@src/app/services/authentication';

@Component({
    selector: 'company-batches',
    templateUrl: './company-batches.component.html',
    styleUrls: ['./company-batches.component.scss']
})
export class CompanyBatchesComponent implements OnInit {

    constructor(
        public authenticationService: AuthenticationService,
        private companyService: CompanyService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private translate: TranslateService
    ) { }

    isLoading: boolean;
    companyUniqueId: string;
    batchesResult: BatchesResult;
    batches: UIBatch[];
    dataSource: MatTableDataSource<UIBatch> = new MatTableDataSource([]);
    columnsToDisplay: string[] = ['check', 'id', 'createdOn', 'isBatchConsistent', 'isDeleted', 'sourceCode', 'execState', 'bts'];

    ngOnInit(): void {
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.updateTable('0');
    }

    updateTable(pageNumber: string): void {
        this.isLoading = true;
        this.companyService
            .batches(pageNumber, this.companyUniqueId)
            .subscribe({
                next: (batchesResult) => {
                    this.batchesResult = batchesResult;
                    this.batches = this.batchesResult.batches.content.map(b => ({
                        batch: b,
                        checked: false,
                        deleted: b.batch.deleted
                    }));
                    this.dataSource = new MatTableDataSource(this.batches);
                },
                complete: () => this.isLoading = false,
            });
    }

    prevPage(): void {
        this.updateTable((this.batchesResult.batches.number - 1).toString());
    }

    nextPage(): void {
        this.updateTable((this.batchesResult.batches.number + 1).toString());
    }

    @ConfirmationDialogMethod({
        question: (batch: UIBatch): QuestionData => {
            return {
                text: marker('batch-company.delete-dialog.Do you want to delete Batch _batchId_'),
                params: { batchId: batch.batch.batch.id }
            };
        },
        rejectTitle: `${marker('batch-company.delete-dialog.Cancel')}`,
        resolveTitle: `${marker('batch-company.delete-dialog.Delete')}`,
    })

    deleteOne(batch: UIBatch): void {
        this.isLoading = true;
        this.companyService
            .processBatchDeleteCommit(this.companyUniqueId, batch.batch.batch.id.toString())
            .subscribe({
                next: () => {

                },
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
        this.companyService
            .processBatchesBulkDeleteCommit(
                this.companyUniqueId,
                this.onlyDeleted()
                    .filter(b => b.checked)
                    .map(b => b.batch.batch.id).toString()
            )
            .subscribe({
                next: () => {

                },
                complete: () => {
                    this.updateTable(this.batchesResult.batches.number.toString());
                }
            });
    }

    checkIndeterminate(): boolean {
        if (this.onlyDeleted().filter(b => b.checked).length &&
            this.onlyDeleted().filter(b => b.checked).length < this.onlyDeleted().length
        ) {
            return true;
        }
        return false;
    }

    allComplete(): boolean {
        return this.onlyDeleted().length === this.onlyDeleted().filter(b => b.checked).length;
    }

    setAllChecked(bool: boolean): void {
        this.onlyDeleted().forEach(b => b.checked = bool);
    }

    someChecked(): boolean {
        return !!this.onlyDeleted().filter(b => b.checked).length;
    }

    private onlyDeleted(): UIBatch[] {
        return this.batches.filter(b => b.deleted);
    }

}
