import { Component, OnInit, viewChild, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { ConfirmationDialogInterface, ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { DispatcherAssetMode } from '@app/enums/DispatcherAssetMode';
import { SourceCodeType } from '@app/enums/SourceCodeType';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { DispatcherAssetModeService } from '@app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';
import { SourceCodesService } from '@app/services/source-codes/source-codes.service';
import { SourceCode } from '@app/services/source-codes/SourceCode';
import { SourceCodesResult } from '@app/services/source-codes/SourceCodesResult';
import { SourceCodesArchiveComponent } from '../source-codes-archive/source-codes-archive.component';
import { NgTemplateOutlet, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtAlertComponent } from '../../ct/ct-alert/ct-alert.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    standalone : true,
    selector: 'source-codes',
    templateUrl: './source-codes.component.html',
    styleUrls: ['./source-codes.component.sass'],
    imports: [MatTabGroup, MatTab, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, NgTemplateOutlet, CtAlertComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, SourceCodesArchiveComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatButton, RouterLink, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DatePipe]
})
export class SourceCodesComponent extends UIStateComponent implements OnInit {
      public readonly dialog = inject(MatDialog);
      private sourceCodesService = inject(SourceCodesService);
      public dispatcherAssetModeService = inject(DispatcherAssetModeService);
    TABINDEX: number = 0;

    sourceCodesResult = signal<SourceCodesResult | undefined>(undefined);
    dataSource = signal<MatTableDataSource<SourceCode>>(new MatTableDataSource<SourceCode>([]));
    columnsToDisplay = signal<string[]>(['id', 'uid', 'type', 'createdOn', 'valid', 'bts']);
    deletedSourceCodes = signal<SourceCode[]>([]);
    archivedSourceCodes = signal<SourceCode[]>([]);

    matTabGroup = viewChild<MatTabGroup>('matTabGroup');
    sourceCodesArchive = viewChild<SourceCodesArchiveComponent>('sourceCodesArchive');

    constructor(public readonly authenticationService: AuthenticationService = inject(AuthenticationService)) {
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
                    this.sourceCodesResult.set(sourceCodesResult);
                    this.dataSource.set(new MatTableDataSource(sourceCodesResult.items.content || []));
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
        this.deletedSourceCodes().push(sourceCode);
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
        this.archivedSourceCodes().push(sourceCode);
        this.sourceCodesService
            .archiveCommit(sourceCode.id.toString())
            .subscribe();
    }

    tabChange(): void {
        if (this.matTabGroup().selectedIndex === 1) {
            this.sourceCodesArchive().updateTable(0);
        }
    }

    nextPage(): void {
        this.updateTable(this.sourceCodesResult().items.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.sourceCodesResult().items.number - 1);
    }

    getType(uid: string): SourceCodeType {
        return this.sourceCodesService.getSourceCodeType(uid, this.sourceCodesResult());
    }
}