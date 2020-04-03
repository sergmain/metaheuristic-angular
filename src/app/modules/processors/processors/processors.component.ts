import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, } from '@angular/material/dialog';
import { MatButton, } from '@angular/material/button';
import { LoadStates } from '@app/enums/LoadStates';
import { Subscription } from 'rxjs';
import { ConfirmationDialogMethod, ConfirmationDialogInterface } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ProcessorsService } from '@src/app/services/processors/processors.service';
import { ListItemProcessor } from '@src/app/services/processors/response';

@Component({
    selector: 'processors',
    templateUrl: './processors.component.html',
    styleUrls: ['./processors.component.scss']
})

export class ProcessorsComponent implements OnInit, ConfirmationDialogInterface {
    readonly states = LoadStates;
    currentState: LoadStates = this.states.loading;

    response;

    showStatusOfProcessor: boolean = false;

    dataSource = new MatTableDataSource<ListItemProcessor>([]);
    columnsToDisplay: string[] = ['id', 'ip', 'description', 'isActive', 'isBlacklisted', 'lastSeen', 'bts'];
    secondColumnsToDisplay = ['empty', 'env'];

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;

    constructor(
        readonly dialog: MatDialog,
        private processorsService: ProcessorsService
    ) { }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnInit() {
        this.getProcessors(0);
    }

    next() {
        this.getProcessors(this.response.items.number + 1);
    }

    prev() {
        this.getProcessors(this.response.items.number - 1);
    }

    getProcessors(page) {
        const subscribe: Subscription = this.processorsService.processors.get(page)
            .subscribe(
                (response) => {
                    const items: ListItemProcessor[] = response.items.content || [];
                    if (items.length) {
                        this.dataSource = new MatTableDataSource(items);
                        this.currentState = this.states.show;
                        this.prevTable.disabled = response.items.first;
                        this.nextTable.disabled = response.items.last;
                    } else {
                        this.currentState = this.states.empty;
                    }
                }
            );
    }
    // TODO: визуально не удаляются

    @ConfirmationDialogMethod({
        question: (processor: ListItemProcessor): string =>
            `Do you want to delete Processor\xa0#${processor.processor.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(processor: ListItemProcessor) {
        const subscribe: Subscription = this.processorsService.processor.delete(processor.processor.id.toString())
            .subscribe(() => this.getProcessors(0));
    }
}