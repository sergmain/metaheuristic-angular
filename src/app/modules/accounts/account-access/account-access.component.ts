import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService, Authority } from '@app/services/accounts';
import { AccountResult } from '@app/services/accounts/AccountResult';
import { forkJoin } from 'rxjs';

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

interface RoleState {
    role: string;
    displayName: string;
    enabled: boolean;
}

@Component({
    selector: 'account-access',
    templateUrl: './account-access.component.html',
    styleUrls: ['./account-access.component.scss'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtSectionContentComponent, MatCheckbox, FormsModule, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton]
})
export class AccountAccessComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private accountsService = inject(AccountsService);

    response = signal<AccountResult | undefined>(undefined);
    roles = signal<RoleState[]>([]);

    ngOnInit(): void {
        const accountId = this.route.snapshot.paramMap.get('accountId');

        forkJoin({
            account: this.accountsService.getAccount(accountId),
            possibleRoles: this.accountsService.getPossibleRoles()
        }).subscribe(({ account, possibleRoles }) => {
            this.response.set(account);

            const userRoles: string[] = account.account.authorities.map((a: Authority) => a.authority);

            const roleStates: RoleState[] = possibleRoles.map(role => ({
                role: role,
                displayName: role,
                enabled: userRoles.includes(role)
            }));

            this.roles.set(roleStates);
        });
    }

    toggleRole(role: RoleState, enabled: boolean): void {
        const updated = this.roles().map(r =>
            r.role === role.role ? { ...r, enabled } : r
        );
        this.roles.set(updated);
    }

    save(): void {
        const accountId = this.route.snapshot.paramMap.get('accountId');
        const selectedRoles = this.roles()
            .filter(r => r.enabled)
            .map(r => r.role)
            .join(',');

        this.accountsService
            .roleFormCommit(accountId, selectedRoles)
            .subscribe(() => { });
    }

    back(): void {
        this.router.navigate(['../..'], { relativeTo: this.route });
    }
}
