import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { DispatcherAssetMode } from '@src/app/enums/DispatcherAssetMode';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AccountsResult, SimpleAccount } from '@src/app/services/accounts';
import { AuthenticationService } from '@src/app/services/authentication';
import { DispatcherAssetModeService } from '@src/app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'accounts-view',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss']
})

export class AccountsComponent extends UIStateComponent implements OnInit {
    dataSource = new MatTableDataSource<SimpleAccount>([]);
    columnsToDisplay = ['id', 'isEnabled', 'login', 'publicName', 'createdOn', 'bts'];
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