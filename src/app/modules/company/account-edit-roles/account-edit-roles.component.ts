import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { AccountWithRoleResult } from '@app/services/company/AccountWithRoleResult';
import { CompanyService } from '@app/services/company/company.service';
import { KeyValuePipe } from '@angular/common';
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
    standalone: true,
    selector: 'account-edit-roles',
    templateUrl: './account-edit-roles.component.html',
    styleUrls: ['./account-edit-roles.component.sass'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, MatCheckbox, FormsModule, CtRestStatusComponent, KeyValuePipe]
})
export class AccountEditRolesComponent implements OnInit {
      private companyService = inject(CompanyService);
      private activatedRoute = inject(ActivatedRoute);
    accountId = signal<string | undefined>(undefined);
    companyUniqueId: string;
    accountWithRoleResult = signal<AccountWithRoleResult | undefined>(undefined);
    operationStatusRest = signal<OperationStatusRest | undefined>(undefined);
    roleModel = signal<Map<string, boolean>>(new Map());

    isLoading = signal<boolean | undefined>(undefined);

    ngOnInit(): void {
        this.isLoading.set(true);
        this.accountId.set(this.activatedRoute.snapshot.paramMap.get('accountId'));
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.companyService
            .editRoles(this.accountId(), this.companyUniqueId)
            .subscribe(accountWithRoleResult => {
                this.accountWithRoleResult.set(accountWithRoleResult);
                this.accountWithRoleResult().possibleRoles.forEach(r => this.roleModel().set(r, false));
                this.accountWithRoleResult().account.authorities.forEach(a => {
                    if (this.roleModel().has(a.authority)) {
                        this.roleModel().set(a.authority, true);
                    }
                });
                this.isLoading.set(false);
            });
    }

    save(role: { key: string, value: boolean }): void {
        this.isLoading.set(true);
        this.companyService
            .rolesEditFormCommit(this.accountId(), role.key, role.value, this.companyUniqueId)
            .subscribe((operationStatusRest: OperationStatusRest) => {
                this.operationStatusRest.set(operationStatusRest);
                this.isLoading.set(false);
            });
    }
}
