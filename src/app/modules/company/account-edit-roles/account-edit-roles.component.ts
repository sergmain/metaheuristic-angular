import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { AccountWithRoleResult } from '@src/app/services/company/AccountWithRoleResult';
import { CompanyService } from '@src/app/services/company/company.service';

@Component({
    selector: 'account-edit-roles',
    templateUrl: './account-edit-roles.component.html',
    styleUrls: ['./account-edit-roles.component.sass']
})
export class AccountEditRolesComponent implements OnInit {

    accountId: string;
    companyUniqueId: string;
    accountWithRoleResult: AccountWithRoleResult;
    operationStatusRest: OperationStatusRest;
    roleModel: Map<string, boolean> = new Map();

    isLoading: boolean;

    constructor(
        private companyService: CompanyService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.accountId = this.activatedRoute.snapshot.paramMap.get('accountId');
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.companyService
            .editRoles(this.accountId, this.companyUniqueId)
            .subscribe(accountWithRoleResult => {
                this.accountWithRoleResult = accountWithRoleResult;
                this.accountWithRoleResult.possibleRoles.forEach(r => this.roleModel.set(r, false));
                this.accountWithRoleResult.account.authorities.forEach(a => {
                    if (this.roleModel.has(a.authority)) {
                        this.roleModel.set(a.authority, true);
                    }
                });
                this.isLoading = false;
            });
    }

    save(role: { key: string, value: boolean }): void {
        this.isLoading = true;
        this.companyService
            .rolesEditFormCommit(this.accountId, role.key, role.value, this.companyUniqueId)
            .subscribe((operationStatusRest: OperationStatusRest) => {
                this.operationStatusRest = operationStatusRest;
                this.isLoading = false;
            });
    }
}
