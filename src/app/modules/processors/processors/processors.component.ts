import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, } from '@angular/material/dialog';
import { ConfirmationDialogMethod, ConfirmationDialogInterface } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ProcessorsService } from '@src/app/services/processors/processors.service';
import { ProcessorsResult } from '@src/app/services/processors/ProcessorsResult';
import { ProcessorStatus } from '@src/app/services/processors/ProcessorStatus';


@Component({
    selector: 'processors',
    templateUrl: './processors.component.html',
    styleUrls: ['./processors.component.scss']
})

export class ProcessorsComponent implements OnInit, ConfirmationDialogInterface {
    processorResult: ProcessorsResult;
    showStatusOfProcessor: boolean = false;
    dataSource: MatTableDataSource<ProcessorStatus> = new MatTableDataSource<ProcessorStatus>([]);
    columnsToDisplay: string[] = ['id', 'ip', 'description', 'reason', 'lastSeen', 'bts'];
    secondColumnsToDisplay: string[] = ['empty', 'env'];

    constructor(
        readonly dialog: MatDialog,
        private processorsService: ProcessorsService
    ) { }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnInit(): void {
        this.getProcessors(0);
    }

    next(): void {
        this.getProcessors(this.processorResult.items.number + 1);
    }

    prev(): void {
        this.getProcessors(this.processorResult.items.number - 1);
    }

    getProcessors(page: number): void {
        this.processorsService
            .init(page.toString())
            .subscribe(processorResult => {
                this.processorResult = processorResult;
                const items: ProcessorStatus[] = processorResult.items.content || [];
                if (items.length) {
                    this.dataSource = new MatTableDataSource(items);
                }
            });
    }
    // TODO: визуально не удаляются

    @ConfirmationDialogMethod({
        question: (processor: ProcessorStatus): string =>
            `Do you want to delete Processor\xa0#${processor.processor.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(processor: ProcessorStatus): void {
        this.processorsService
            .deleteProcessorCommit(processor.processor.id.toString())
            .subscribe(() => this.getProcessors(0));
    }
}