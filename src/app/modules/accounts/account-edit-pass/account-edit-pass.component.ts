import { Component, OnInit } from '@angular/core';
import { Location, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { LoadStates } from '@app/enums/LoadStates';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'account-edit-pass',
    templateUrl: './account-edit-pass.component.html',
    styleUrls: ['./account-edit-pass.component.scss'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, FormsModule, ReactiveFormsModule, CtSectionContentComponent, MatFormField, MatLabel, MatInput, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, NgIf, NgFor]
})

export class AccountEditPassComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    response;
    account: SimpleAccount;

    form = new FormGroup({
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        password2: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            (control: FormControl): any => {
                const group: FormGroup = this.form;
                if (group) {
                    return (group.value.password === control.value) ? null : {
                        notSame: true
                    };
                }
                return null;
            }
        ]),
    });

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

    back() {
        this.location.back();
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

    save() {
        this.currentStates.add(this.states.wait);
        this.accountsService
            .passwordEditFormCommit(this.account.id.toString(), this.form.value.password, this.form.value.password2)
            .subscribe(
                (response: any) => {
                    this.router.navigate(['/dispatcher', 'accounts']);
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.wait);
                }
            );
    }
}