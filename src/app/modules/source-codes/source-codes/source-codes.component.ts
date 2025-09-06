import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { ConfirmationDialogInterface, ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { DispatcherAssetMode } from '@src/app/enums/DispatcherAssetMode';
import { SourceCodeType } from '@src/app/enums/SourceCodeType';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import { DispatcherAssetModeService } from '@src/app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
import { SourceCode } from '@src/app/services/source-codes/SourceCode';
import { SourceCodesResult } from '@src/app/services/source-codes/SourceCodesResult';
import { SourceCodesArchiveComponent } from '../source-codes-archive/source-codes-archive.component';

@Component({
    selector: 'source-codes',
    templateUrl: './source-codes.component.html',
    styleUrls: ['./source-codes.component.sass'],
    standalone: false
})
export class SourceCodesComponent extends UIStateComponent implements OnInit {

    TABINDEX: number = 0;

    sourceCodesResult: SourceCodesResult;
    dataSource: MatTableDataSource<SourceCode> = new MatTableDataSource<SourceCode>([]);
    columnsToDisplay: string[] = ['id', 'uid', 'type', 'createdOn', 'valid', 'bts'];
    deletedSourceCodes: SourceCode[] = [];
    archivedSourceCodes: SourceCode[] = [];

    @ViewChild('matTabGroup', { static: true }) matTabGroup: MatTabGroup;
    @ViewChild('sourceCodesArchive', { static: true }) sourceCodesArchive: SourceCodesArchiveComponent;

    constructor(
        readonly dialog: MatDialog,
        private sourceCodesService: SourceCodesService,
        public dispatcherAssetModeService: DispatcherAssetModeService,
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
            .sourceCodes(page.toString())
            .subscribe({
                next: sourceCodesResult => {
                    this.sourceCodesResult = sourceCodesResult;
                    this.dataSource = new MatTableDataSource(sourceCodesResult.items.content || []);
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }

    @ConfirmationDialogMethod({
        question: (sourceCode: SourceCode): string =>
            `Do you want to delete SourceCode\xa0#${sourceCode.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(sourceCode: SourceCode): void {
        this.deletedSourceCodes.push(sourceCode);
        this.sourceCodesService
            .deleteCommit(sourceCode.id.toString())
            .subscribe();
    }

    @ConfirmationDialogMethod({
        question: (sourceCode: SourceCode): string =>
            `Do you want to archive SourceCode\xa0#${sourceCode.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Archive'
    })
    archive(sourceCode: SourceCode): void {
        this.archivedSourceCodes.push(sourceCode);
        this.sourceCodesService
            .archiveCommit(sourceCode.id.toString())
            .subscribe();
    }

    tabChange(): void {
        if (this.matTabGroup.selectedIndex === 1) {
            this.sourceCodesArchive.updateTable(0);
        }
    }

    nextPage(): void {
        this.updateTable(this.sourceCodesResult.items.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.sourceCodesResult.items.number - 1);
    }

    getType(uid: string): SourceCodeType {
        return this.sourceCodesService.getSourceCodeType(uid, this.sourceCodesResult);
    }

}