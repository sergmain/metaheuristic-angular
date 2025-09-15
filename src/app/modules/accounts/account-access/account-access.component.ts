import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService, Authority, SimpleAccount } from '@app/services/accounts';
import { Role } from '@app/services/authentication';
import { AccountResult } from '@app/services/accounts/AccountResult';
import { NgIf } from '@angular/common';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionContentComponent } from '../../ct/ct-section-content/ct-section-content.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'account-access',
    templateUrl: './account-access.component.html',
    styleUrls: ['./account-access.component.scss'],
    imports: [NgIf, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtSectionContentComponent, MatCheckbox, FormsModule, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton]
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
        this.accountsService
            .getAccount(this.route.snapshot.paramMap.get('accountId'))
            .subscribe((response) => {
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

        this.accountsService
            .roleFormCommit(accountId, roles.join(','))
            .subscribe(() => { });
    }

    back(): void {
        this.router.navigate(['../..'], { relativeTo: this.route });
    }
}
