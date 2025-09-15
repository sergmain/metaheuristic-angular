import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { AccountWithRoleResult } from '@app/services/company/AccountWithRoleResult';
import { CompanyService } from '@app/services/company/company.service';
import { NgIf, NgFor, KeyValuePipe } from '@angular/common';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';

@Component({
    selector: 'account-edit-roles',
    templateUrl: './account-edit-roles.component.html',
    styleUrls: ['./account-edit-roles.component.sass'],
    imports: [NgIf, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, NgFor, MatCheckbox, FormsModule, CtRestStatusComponent, KeyValuePipe]
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
