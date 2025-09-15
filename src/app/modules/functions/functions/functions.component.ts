import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { DispatcherAssetModeService } from '@app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';
import { FunctionEntity } from '@app/services/functions/FunctionEntity';
import { FunctionsService } from '@app/services/functions/functions.service';
import { FunctionsResult } from '@app/services/functions/FunctionsResult';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CtAlertComponent } from '../../ct/ct-alert/ct-alert.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { CtPreComponent } from '../../ct/ct-pre/ct-pre.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: "functions",
    templateUrl: './functions.component.html',
    styleUrls: ['./functions.component.scss'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, MatSlideToggle, FormsModule, NgTemplateOutlet, CtAlertComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, CtPreComponent, MatButton, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, RouterLink]
})
export class FunctionsComponent extends UIStateComponent implements OnInit {
    functionsResult: FunctionsResult;
    dataSource = new MatTableDataSource<FunctionEntity>([]);
    columnsToDisplay: string[] = ['code', 'type', 'params', 'bts'];
    deletedRows: FunctionEntity[] = [];
    showParams: boolean = false;

    constructor(
        private functionService: FunctionsService,
        public dispatcherAssetModeService: DispatcherAssetModeService,
        readonly dialog: MatDialog,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit() {
        this.updateTable(0);
    }

    updateTable(page: number) {
        this.setIsLoadingStart();
        this.functionService
            .getFunctions(page.toString())
            .subscribe({
                next: functionsResult => {
                    this.functionsResult = functionsResult;
                    this.dataSource = new MatTableDataSource(functionsResult.functions);
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }

    @ConfirmationDialogMethod({
        question: (functionEntity: FunctionEntity): string =>
            `Do you want to delete Function\xa0#${functionEntity.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete',
    })
    delete(functionEntity: FunctionEntity) {
        this.deletedRows.push(functionEntity);
        this.functionService.deleteCommit(functionEntity.id.toString()).subscribe();
    }

    // INFO: functionsResult не содержит pageable
    // INFO: листание
    // TODO p0 2023-11-13 add
    nextPage() {
        // this.updateTable(this...items.number + 1);
    }

    prevPage() {
        // this.updateTable(this...items.number - 1);
    }
}
