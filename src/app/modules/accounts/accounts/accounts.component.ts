import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { DispatcherAssetMode } from '@app/enums/DispatcherAssetMode';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AccountsResult, SimpleAccount } from '@app/services/accounts';
import { AuthenticationService } from '@app/services/authentication';
import { DispatcherAssetModeService } from '@app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';
import { NgIf, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtAlertComponent } from '../../ct/ct-alert/ct-alert.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'accounts-view',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtAlertComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatButton, RouterLink, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, DatePipe]
})

export class AccountsComponent extends UIStateComponent implements OnInit {
    dataSource = new MatTableDataSource<SimpleAccount>([]);
    columnsToDisplay = ['id', 'isEnabled', 'login', 'publicName', 'createdOn', 'roles', 'bts'];
    accountsResult: AccountsResult;

    constructor(
        private accountsService: AccountsService,
        public dispatcherAssetModeService: DispatcherAssetModeService,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService)
    }

    ngOnInit() {
        this.updateTable(0);
    }

    updateTable(page: number) {
        this.setIsLoadingStart()
        this.accountsService
            .accounts(page.toString())
            .subscribe({
                next: accountsResult => {
                    this.accountsResult = accountsResult;
                    this.dataSource = new MatTableDataSource(this.accountsResult.accounts.content || []);
                },
                complete: () => {
                    this.setIsLoadingEnd()
                }
            })
    }

    nextPage() {
        this.updateTable(this.accountsResult.accounts.number + 1);
    }

    prevPage() {
        this.updateTable(this.accountsResult.accounts.number - 1);
    }

}