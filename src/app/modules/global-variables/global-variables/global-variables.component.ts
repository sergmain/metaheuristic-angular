import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, } from '@angular/material/dialog';
import { MatButton, } from '@angular/material/button';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
 import { CtTableComponent } from '@src/app/modules/ct/ct-table/ct-table.component';
import { GlobalVariablesService } from '@src/app/services/global-variables/global-variables.service';
import { GlobalVariable } from '@src/app/services/global-variables/GlobalVariables';

@Component({
    selector: 'global-variables',
    templateUrl: './global-variables.component.html',
    styleUrls: ['./global-variables.component.scss'],
})

export class GlobalVariablesComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    response;
    deletedRows: GlobalVariable[] = [];
    dataSource = new MatTableDataSource<GlobalVariable>([]);
    columnsToDisplay: (string)[] = [
        'id',
        'variable',
        'uploadTs',
        'filename',
        'storageUrl',
        'bts'
    ];

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('table', { static: true }) table: CtTableComponent;

    constructor(
        private dialog: MatDialog,
        private globalVariablesService: GlobalVariablesService
    ) { }

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.updateTable(0);
    }

    updateTable(page: number) {
        this.currentStates.add(this.states.loading);
        this.globalVariablesService.variables.get(page.toString())
            .subscribe(v => {
                this.response = v;
                this.dataSource = new MatTableDataSource(v.items.content || []);
                this.table.show();
                this.currentStates.delete(this.states.firstLoading);
                this.currentStates.delete(this.states.loading);
                this.prevTable.disabled = this.response.items.first;
                this.nextTable.disabled = this.response.items.last;
            });
    }

    @ConfirmationDialogMethod({
        question: (globalVariable: GlobalVariable): string =>
            `Do you want to delete Variable\xa0#${globalVariable.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(globalVariable: GlobalVariable) {
        this.deletedRows.push(globalVariable);
        this.globalVariablesService.variable.delete(globalVariable.id.toString())
            .subscribe();
    }

    next() {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.response.items.number + 1);
    }

    prev() {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.response.items.number - 1);
    }
}