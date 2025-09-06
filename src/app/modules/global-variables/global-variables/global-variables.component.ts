import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, } from '@angular/material/dialog';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { GlobalVariablesService } from '@src/app/services/global-variables/global-variables.service';
import { GlobalVariable } from '@src/app/services/global-variables/GlobalVariables';
import { GlobalVariablesResult } from '@src/app/services/global-variables/GlobalVariablesResult';

@Component({
    selector: 'global-variables',
    templateUrl: './global-variables.component.html',
    styleUrls: ['./global-variables.component.scss'],
    standalone: false
})

export class GlobalVariablesComponent implements OnInit {
    isLoading: boolean;

    globalVariablesResult: GlobalVariablesResult;
    deletedRows: GlobalVariable[] = [];
    dataSource: MatTableDataSource<GlobalVariable> = new MatTableDataSource<GlobalVariable>([]);
    columnsToDisplay: (string)[] = ['id', 'variable', 'uploadTs', 'filename', 'params', 'bts'];

    constructor(
        private dialog: MatDialog,
        private globalVariablesService: GlobalVariablesService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.isLoading = true;
        this.globalVariablesService
            .getResources(page.toString())
            .subscribe(globalVariablesResult => {
                this.globalVariablesResult = globalVariablesResult;
                this.changeDetectorRef.detectChanges();
                this.dataSource = new MatTableDataSource(globalVariablesResult.items.content || []);
                this.isLoading = false;
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
        this.globalVariablesService
            .deleteResource(globalVariable.id.toString())
            .subscribe();
    }

    nextPage(): void {
        this.updateTable(this.globalVariablesResult.items.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.globalVariablesResult.items.number - 1);
    }
}