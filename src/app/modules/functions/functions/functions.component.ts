import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import { DispatcherAssetModeService } from '@src/app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';
import { FunctionEntity } from '@src/app/services/functions/FunctionEntity';
import { FunctionsService } from '@src/app/services/functions/functions.service';
import { FunctionsResult } from '@src/app/services/functions/FunctionsResult';

@Component({
    selector: "functions",
    templateUrl: './functions.component.html',
    styleUrls: ['./functions.component.scss'],
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
