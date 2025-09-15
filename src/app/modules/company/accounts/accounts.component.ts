import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DispatcherAssetMode } from '@app/enums/DispatcherAssetMode';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AccountsResult } from '@app/services/accounts/AccountsResult';
import { SimpleAccount } from '@app/services/accounts/SimpleAccount';
import { AuthenticationService } from '@app/services/authentication';
import { CompanyService } from '@app/services/company/company.service';
import { DispatcherAssetModeService } from '@app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';
import { NgIf, NgTemplateOutlet, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtAlertComponent } from '../../ct/ct-alert/ct-alert.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatButton } from '@angular/material/button';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';

@Component({
    selector: 'accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.sass'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, NgTemplateOutlet, CtAlertComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatButton, RouterLink, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, DatePipe]
})
export class AccountsComponent extends UIStateComponent implements OnInit {
    dataSource: MatTableDataSource<SimpleAccount> = new MatTableDataSource<SimpleAccount>([]);
    columnsToDisplay: string[] = ['id', 'isEnabled', 'login', 'publicName', 'role', 'createdOn', 'bts'];
    accountsResult: AccountsResult;
    companyUniqueId: string;

    constructor(
        private companyService: CompanyService,
        private activatedRoute: ActivatedRoute,
        public dispatcherAssetModeService: DispatcherAssetModeService,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.setIsLoadingStart();
        this.companyService
            .accounts(page.toString(), this.companyUniqueId)
            .subscribe({
                next: accountsResult => {
                    this.accountsResult = accountsResult;
                    this.dataSource = new MatTableDataSource(this.accountsResult.accounts.content || []);
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }

    nextPage(): void {
        this.updateTable(this.accountsResult.accounts.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.accountsResult.accounts.number - 1);
    }
}
