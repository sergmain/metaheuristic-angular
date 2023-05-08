import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, } from '@angular/material/dialog';
import { ConfirmationDialogMethod, ConfirmationDialogInterface } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ProcessorsService } from '@src/app/services/processors/processors.service';
import { ProcessorsResult } from '@src/app/services/processors/ProcessorsResult';
import { ProcessorStatus } from '@src/app/services/processors/ProcessorStatus';
import { SelectionModel } from '@angular/cdk/collections';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';


@Component({
    selector: 'processors',
    templateUrl: './processors.component.html',
    styleUrls: ['./processors.component.scss']
})

export class ProcessorsComponent extends UIStateComponent implements OnInit, ConfirmationDialogInterface {
    processorResult: ProcessorsResult;
    showStatusOfProcessor: boolean = false;
    dataSource: MatTableDataSource<ProcessorStatus> = new MatTableDataSource<ProcessorStatus>([]);
    selection: SelectionModel<ProcessorStatus> = new SelectionModel<ProcessorStatus>(true, []);
    columnsToDisplay: string[] = ['check', 'id', 'ip', 'description', 'reason', 'cores', 'bts'];
    secondColumnsToDisplay: string[] = ['empty', 'env'];

    constructor(
        readonly dialog: MatDialog,
        private processorsService: ProcessorsService,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.isLoading = true;
        this.processorsService
            .init(page.toString())
            .subscribe(processorResult => {
                this.processorResult = processorResult;
                const items: ProcessorStatus[] = processorResult.items.content || [];
                if (items.length) {
                    this.dataSource = new MatTableDataSource(items);
                }
                this.isLoading = false;
            });
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    isAllSelected(): boolean {
        return this.selection.selected.length === this.dataSource.data.length;
    }

    masterToggle(): void {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    nextPage(): void {
        this.updateTable(this.processorResult.items.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.processorResult.items.number - 1);
    }

    @ConfirmationDialogMethod({
        question: (processor: ProcessorStatus): string =>
            `Do you want to delete Processor\xa0#${processor.processor.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(processor: ProcessorStatus): void {
        this.processorsService
            .deleteProcessorCommit(processor.processor.id.toString())
            .subscribe(() => this.updateTable(this.processorResult.items.number));
    }

    @ConfirmationDialogMethod({
        question: (): string => `Do you want to delete Processors`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    deleteMany(): void {
        this.processorsService
            .processProcessorBulkDeleteCommit(this.selection.selected.map(v => v.processor.id.toString()))
            .subscribe(() => this.updateTable(this.processorResult.items.number));
    }
}