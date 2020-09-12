import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, } from '@angular/material/dialog';
import { MatButton, } from '@angular/material/button';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { CtTableComponent } from '@src/app/modules/ct/ct-table/ct-table.component';
import { GlobalVariablesService } from '@src/app/services/global-variables/global-variables.service';
import { GlobalVariable } from '@src/app/services/global-variables/GlobalVariables';
import { GlobalVariablesResult } from '@src/app/services/global-variables/GlobalVariablesResult';

@Component({
    selector: 'global-variables',
    templateUrl: './global-variables.component.html',
    styleUrls: ['./global-variables.component.scss'],
})

export class GlobalVariablesComponent implements OnInit {
    responseGlobalVariables: GlobalVariablesResult;
    deletedRows: GlobalVariable[] = [];
    dataSource: MatTableDataSource<GlobalVariable> = new MatTableDataSource<GlobalVariable>([]);
    columnsToDisplay: (string)[] = ['id', 'variable', 'uploadTs', 'filename', 'params', 'bts'];

    @ViewChild('nextTable', { static: false }) nextTable: MatButton;
    @ViewChild('prevTable', { static: false }) prevTable: MatButton;
    @ViewChild('table', { static: false }) table: CtTableComponent;

    constructor(
        private dialog: MatDialog,
        private globalVariablesService: GlobalVariablesService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.globalVariablesService.variables.get(page.toString())
            .subscribe(response => {
                this.responseGlobalVariables = response;
                this.changeDetectorRef.detectChanges();
                this.dataSource = new MatTableDataSource(response.items.content || []);
                this.table.show();
                this.prevTable.disabled = this.responseGlobalVariables.items.first;
                this.nextTable.disabled = this.responseGlobalVariables.items.last;
            });
    }

    @ConfirmationDialogMethod({
        question: (globalVariable: GlobalVariable): string =>
            `Do you want to delete Variable\xa0#${globalVariable.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(globalVariable: GlobalVariable): void {
        this.deletedRows.push(globalVariable);
        this.globalVariablesService.variable
            .deleteCommit(globalVariable.id.toString())
            .subscribe();
    }

    next(): void {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.responseGlobalVariables.items.number + 1);
    }

    prev(): void {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.responseGlobalVariables.items.number - 1);
    }
}