import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@app/services/company/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountResult } from '@app/services/accounts';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { OperationStatus } from '@app/enums/OperationStatus';
import { NgIf } from '@angular/common';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';

@Component({
    selector: 'account-edit',
    templateUrl: './account-edit.component.html',
    styleUrls: ['./account-edit.component.sass'],
    imports: [NgIf, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, MatFormField, MatLabel, MatInput, FormsModule, MatCheckbox, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtRestStatusComponent]
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
