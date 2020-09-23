import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@src/app/services/company/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountResult } from '@src/app/services/accounts';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { OperationStatus } from '@src/app/enums/OperationStatus';

@Component({
    selector: 'account-edit',
    templateUrl: './account-edit.component.html',
    styleUrls: ['./account-edit.component.sass']
})
export class AccountEditComponent implements OnInit {

    companyUniqueId: string;
    accountId: string;
    accountResult: AccountResult;
    operationStatusRest: OperationStatusRest;
    enabled;
    publicName;

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
            });
    }

    back(): void {
        this.router.navigate(['../../../', 'accounts'], { relativeTo: this.activatedRoute });
    }

    saveChanges(): void {
        this.companyService
            .editFormCommitAccount(this.accountId, this.publicName, this.enabled, this.companyUniqueId)
            .subscribe((operationStatusRest: OperationStatusRest) => {
                if (operationStatusRest.status === OperationStatus.OK) {
                    this.back();
                } else {
                    this.operationStatusRest = operationStatusRest;
                }
            });
    }
}
