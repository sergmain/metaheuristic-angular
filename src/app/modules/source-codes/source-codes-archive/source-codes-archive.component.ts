import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { SourceCodesService } from '@app/services/source-codes/source-codes.service';
import { SourceCode } from '@app/services/source-codes/SourceCode';
import { SourceCodesResult } from '@app/services/source-codes/SourceCodesResult';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { NgIf, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatIcon } from '@angular/material/icon';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';


@Component({
    standalone : true,
    selector: 'source-codes-archive',
    templateUrl: './source-codes-archive.component.html',
    styleUrls: ['./source-codes-archive.component.sass'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatButton, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, DatePipe]
})
export class SourceCodesArchiveComponent extends UIStateComponent implements OnInit {
    sourceCodesResult: SourceCodesResult;
    dataSource = new MatTableDataSource<SourceCode>([]);
    columnsToDisplay = ['id', 'uid', 'createdOn', 'valid', 'locked', 'bts'];
    deletedRows: SourceCode[] = [];

    constructor(
        readonly dialog: MatDialog,
        private sourceCodesService: SourceCodesService,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.setIsLoadingStart();
        this.sourceCodesService
            .sourceCodeArchivedOnly(page.toString())
            .subscribe({
                next: sourceCodesResult => {
                    this.sourceCodesResult = sourceCodesResult;
                    this.dataSource = new MatTableDataSource(sourceCodesResult.items.content || []);
                },
                complete: () => {
                    this.setIsLoadingEnd();
                },
            });
    }

    @ConfirmationDialogMethod({
        question: (sourceCode: SourceCode): string =>
            `Do you want to delete SourceCode #${sourceCode.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(sourceCode: SourceCode): void {
        this.deletedRows.push(sourceCode);
        this.sourceCodesService
            .deleteCommit(sourceCode.id.toString())
            .subscribe();
    }

    nextPage(): void {
        this.updateTable(this.sourceCodesResult.items.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.sourceCodesResult.items.number - 1);
    }

}