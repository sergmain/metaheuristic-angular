import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, AccountsService, Authority } from '@app/services/accounts';
import { Role } from '@app/services/authentication';
import { AccountResult } from '@src/app/services/accounts/AccountResult';

@Component({
    selector: 'account-access',
    templateUrl: './account-access.component.html',
    styleUrls: ['./account-access.component.scss'],
})
export class AccountAccessComponent implements OnInit {
    account: Account;
    response: AccountResult;

    isManager: boolean = false;
    isOperator: boolean = false;
    isBilling: boolean = false;
    isData: boolean = false;
    isAdmin: boolean = false;
    isServerRestAccess: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private accountsService: AccountsService
    ) { }

    ngOnInit(): void {
        this.accountsService.account.get(this.route.snapshot.paramMap.get('accountId')).subscribe((response) => {
            this.response = response;
            this.account = response.account;
            this.account.authorities.forEach((authority: Authority) => {
                this.isManager = authority.authority === Role.Manager;
                this.isOperator = authority.authority === Role.Operator;
                this.isBilling = authority.authority === Role.Billing;
                this.isData = authority.authority === Role.Data;
                this.isAdmin = authority.authority === Role.Admin;
                this.isServerRestAccess = authority.authority === Role.ServerRestAccess;
            });
        });
    }

    save(): void {
        const roles: string[] = [];
        const accountId: string = this.route.snapshot.paramMap.get('accountId');

        if (this.isAdmin) { roles.push(Role.Admin); }
        if (this.isBilling) { roles.push(Role.Billing); }
        if (this.isData) { roles.push(Role.Data); }
        if (this.isManager) { roles.push(Role.Manager); }
        if (this.isOperator) { roles.push(Role.Operator); }

        this.accountsService.account.roleCommit(accountId, roles.join(',')).subscribe(() => { });
    }

    back(): void {
        this.router.navigate(['/dispatcher', 'accounts']);
    }
}
