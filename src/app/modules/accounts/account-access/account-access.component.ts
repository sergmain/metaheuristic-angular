import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService, Authority, SimpleAccount } from '@app/services/accounts';
import { Role } from '@app/services/authentication';
import { AccountResult } from '@src/app/services/accounts/AccountResult';

@Component({
    selector: 'account-access',
    templateUrl: './account-access.component.html',
    styleUrls: ['./account-access.component.scss'],
})
export class AccountAccessComponent implements OnInit {
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
            const roles: Role[] = [];
            response.account.authorities.forEach((authority: Authority) => roles.push(authority.authority));
            this.isManager = roles.includes(Role.ROLE_MANAGER);
            this.isOperator = roles.includes(Role.ROLE_OPERATOR);
            this.isBilling = roles.includes(Role.ROLE_BILLING);
            this.isData = roles.includes(Role.ROLE_DATA);
            this.isAdmin = roles.includes(Role.ROLE_ADMIN);
            this.isServerRestAccess = roles.includes(Role.ROLE_SERVER_REST_ACCESS);
        });
    }

    save(): void {
        const roles: string[] = [];
        const accountId: string = this.route.snapshot.paramMap.get('accountId');

        if (this.isAdmin) { roles.push(Role.ROLE_ADMIN); }
        if (this.isBilling) { roles.push(Role.ROLE_BILLING); }
        if (this.isData) { roles.push(Role.ROLE_DATA); }
        if (this.isManager) { roles.push(Role.ROLE_MANAGER); }
        if (this.isOperator) { roles.push(Role.ROLE_OPERATOR); }
        if (this.isServerRestAccess) { roles.push(Role.ROLE_SERVER_REST_ACCESS); }

        console.log(roles)

        this.accountsService.account.roleCommit(accountId, roles.join(',')).subscribe(() => { });
    }

    back(): void {
        this.router.navigate(['../..'], { relativeTo: this.route });
    }
}
