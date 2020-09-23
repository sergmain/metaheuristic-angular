import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@src/app/services/company/company.service';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleCompanyResult } from '@src/app/services/company/SimpleCompanyResult';
import { OperationStatus } from '@src/app/enums/OperationStatus';

@Component({
    selector: 'company-edit',
    templateUrl: './company-edit.component.html',
    styleUrls: ['./company-edit.component.sass']
})
export class CompanyEditComponent implements OnInit {

    companyUniqueId: string;
    name: string;
    groups: string;
    operationStatusRest: OperationStatusRest;
    simpleCompanyResult: SimpleCompanyResult;

    constructor(
        private companyService: CompanyService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.companyService
            .editCompany(this.companyUniqueId)
            .subscribe(simpleCompanyResult => {
                this.simpleCompanyResult = simpleCompanyResult;
                this.name = simpleCompanyResult.company.name;
                this.groups = simpleCompanyResult.companyAccessControl.groups;
            });
    }

    saveChanges(): void {
        this.companyService
            .editFormCommitCompany(this.companyUniqueId, this.name, this.groups)
            .subscribe(operationStatusRest => {
                if (operationStatusRest.status === OperationStatus.OK) {
                    this.back();
                } else {
                    this.operationStatusRest = operationStatusRest;
                }
            });
    }
    back(): void {
        this.router.navigate(['../../companies'], { relativeTo: this.activatedRoute });
    }
}
