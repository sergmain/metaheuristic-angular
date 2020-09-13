import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AccountsResult } from '@src/app/services/accounts/AccountsResult';
import { SimpleAccount } from '@src/app/services/accounts/SimpleAccount';
import { CompanyService } from '@src/app/services/company/company.service';

@Component({
    selector: 'accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
    dataSource: MatTableDataSource<SimpleAccount> = new MatTableDataSource<SimpleAccount>([]);
    columnsToDisplay: string[] = ['id', 'isEnabled', 'login', 'publicName', 'role', 'createdOn', 'bts'];
    accountsResult: AccountsResult;
    companyUniqueId: string;
    isLoading: boolean;


    constructor(
        private companyService: CompanyService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.isLoading = true;
        this.companyService
            .accounts(page.toString(), this.companyUniqueId)
            .subscribe(accountsResult => {
                this.accountsResult = accountsResult;
                this.dataSource = new MatTableDataSource(this.accountsResult.accounts.content || []);
                this.isLoading = false;
            });
    }

    nextPage(): void {
        this.updateTable(this.accountsResult.accounts.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.accountsResult.accounts.number - 1);
    }
}
