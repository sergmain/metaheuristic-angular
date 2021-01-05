import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DispatcherAssetMode } from '@src/app/enums/DispatcherAssetMode';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AccountsResult } from '@src/app/services/accounts/AccountsResult';
import { SimpleAccount } from '@src/app/services/accounts/SimpleAccount';
import { AuthenticationService } from '@src/app/services/authentication';
import { CompanyService } from '@src/app/services/company/company.service';
import { DispatcherAssetModeService } from '@src/app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';

@Component({
    selector: 'accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.sass']
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
