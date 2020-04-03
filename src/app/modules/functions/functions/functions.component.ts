import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatDialog, MatTableDataSource } from '@angular/material';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
 import { CtTableComponent } from '@src/app/modules/ct/ct-table/ct-table.component';
import { FuncrionsService } from '@src/app/services/functions/functions.service';
import { FunctionEntity } from '@src/app/services/functions/FunctionEntity';

@Component({
    selector: 'functions',
    templateUrl: './functions.component.html',
    styleUrls: ['./functions.component.scss']
})

export class FunctionsComponent implements OnInit {
    readonly states: any = LoadStates;
    currentState: Set<LoadStates> = new Set();
    response;
    dataSource = new MatTableDataSource<FunctionEntity>([]);
    columnsToDisplay: string[] = ['code', 'type', 'params', 'bts'];
    deletedRows: FunctionEntity[] = [];

    showParams: boolean = false;

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('table') table: CtTableComponent;

    constructor(
        private functionService: FuncrionsService,
        private dialog: MatDialog
    ) {
        this.currentState.add(this.states.loading);
    }

    ngOnInit() {
        this.updateTable(0);
    }

    updateTable(page: number) {
        // TODO: response не содержит pageable
        // TODO: листание
        this.functionService.functions.get(page.toString())
            .subscribe(v => {
                this.response = v;
                const items = v.functions || [];
                if (items.length) {
                    this.dataSource = new MatTableDataSource(items);
                    this.currentState.add(LoadStates.show);
                } else {
                    this.currentState.add(LoadStates.empty);
                }
                this.currentState.delete(LoadStates.loading);
            }
            );
    }

    @ConfirmationDialogMethod({
        question: (functionEntity: FunctionEntity): string =>
            `Do you want to delete Function\xa0#${functionEntity.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(functionEntity: FunctionEntity) {
        this.deletedRows.push(functionEntity);
        this.functionService.function
            .delete(functionEntity.id)
            .subscribe();
    }

    next() {
        // this.updateTable(this...items.number + 1);
    }

    prev() {
        // this.updateTable(this...items.number - 1);
    }
}