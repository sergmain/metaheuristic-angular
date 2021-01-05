import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
import { SourceCode } from '@src/app/services/source-codes/SourceCode';
import { SourceCodesResult } from '@src/app/services/source-codes/SourceCodesResult';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';


@Component({
    selector: 'source-codes-archive',
    templateUrl: './source-codes-archive.component.html',
    styleUrls: ['./source-codes-archive.component.sass']
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