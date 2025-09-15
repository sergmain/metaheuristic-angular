import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatDialog, } from '@angular/material/dialog';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { GlobalVariablesService } from '@app/services/global-variables/global-variables.service';
import { GlobalVariable } from '@app/services/global-variables/GlobalVariables';
import { GlobalVariablesResult } from '@app/services/global-variables/GlobalVariablesResult';
import { NgIf, NgTemplateOutlet, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { CtPreComponent } from '../../ct/ct-pre/ct-pre.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'global-variables',
    templateUrl: './global-variables.component.html',
    styleUrls: ['./global-variables.component.scss'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, NgTemplateOutlet, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, CtPreComponent, MatButton, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, RouterLink, DatePipe]
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