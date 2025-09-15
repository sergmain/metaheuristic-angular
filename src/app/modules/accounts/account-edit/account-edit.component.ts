import { Component, OnInit } from '@angular/core';
import { Location, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { LoadStates } from '@app/enums/LoadStates';
import { SimpleAccount } from '@app/services/accounts';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionContentComponent } from '../../ct/ct-section-content/ct-section-content.component';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'account-edit',
    templateUrl: './account-edit.component.html',
    styleUrls: ['./account-edit.component.scss'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, NgIf, CtSectionBodyComponent, CtSectionBodyRowComponent, CtSectionContentComponent, MatFormField, MatLabel, MatInput, FormsModule, MatCheckbox, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, NgFor]
})
export class AccountEditComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    response;
    account: SimpleAccount;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountsService: AccountsService,
        private location: Location
    ) { }

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.getAccount();
    }


    getAccount(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.accountsService
            .getAccount(id)
            .subscribe(
                (response) => {
                    this.account = response.account;
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.firstLoading);
                }
            );
    }

    back() {
        this.location.back();
    }

    save() {
        this.currentStates.add(this.states.wait);
        this.accountsService
            .editFormCommit(this.account.id.toString(), this.account.publicName, this.account.enabled)
            .subscribe(
                (response) => {
                    this.router.navigate(['/dispatcher', 'accounts']);
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.wait);
                }
            );
    }
}