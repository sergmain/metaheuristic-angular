import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@app/services/company/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountResult } from '@app/services/accounts';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { OperationStatus } from '@app/enums/OperationStatus';

@Component({
    selector: 'account-edit',
    templateUrl: './account-edit.component.html',
    styleUrls: ['./account-edit.component.sass'],
    standalone: false
})
export class AccountEditComponent implements OnInit {

    companyUniqueId: string;
    accountId: string;
    accountResult: AccountResult;
    operationStatusRest: OperationStatusRest;
    isEnabled: boolean;
    publicName: string;
    username: string;

    constructor(
        private companyService: CompanyService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.accountId = this.activatedRoute.snapshot.paramMap.get('accountId');
        this.companyService
            .edit(this.companyUniqueId, this.accountId)
            .subscribe(accountResult => {
                this.accountResult = accountResult;
                this.username = accountResult.account.username;
                this.publicName = accountResult.account.publicName;
                this.isEnabled = accountResult.account.enabled;
            });
    }

    back(): void {
        this.router.navigate(['../../../', 'accounts'], { relativeTo: this.activatedRoute });
    }

    saveChanges(): void {
        this.companyService
            .editFormCommit(this.accountId, this.publicName, this.isEnabled, this.companyUniqueId)
            .subscribe((operationStatusRest: OperationStatusRest) => {
                if (operationStatusRest.status === OperationStatus.OK) {
                    this.back();
                } else {
                    this.operationStatusRest = operationStatusRest;
                }
            });
    }
}
