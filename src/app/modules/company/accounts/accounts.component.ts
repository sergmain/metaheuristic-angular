import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DispatcherAssetMode } from '@app/enums/DispatcherAssetMode';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AccountsResult } from '@app/services/accounts/AccountsResult';
import { SimpleAccount } from '@app/services/accounts/SimpleAccount';
import { AuthenticationService } from '@app/services/authentication';
import { CompanyService } from '@app/services/company/company.service';
import { DispatcherAssetModeService } from '@app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';

@Component({
    selector: 'accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.sass'],
    standalone: false
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
