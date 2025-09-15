import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { DefaultResponse } from '@app/models/DefaultResponse';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { OperationStatus } from '@app/enums/OperationStatus';
import { Subscription } from 'rxjs';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionContentComponent } from '../../ct/ct-section-content/ct-section-content.component';
import { MatFormField, MatLabel, MatInput, MatHint } from '@angular/material/input';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'account-add',
    templateUrl: './account-add.component.html',
    styleUrls: ['./account-add.component.scss'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, FormsModule, ReactiveFormsModule, CtSectionContentComponent, MatFormField, MatLabel, MatInput, MatHint, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, RouterLink, NgIf, NgFor]
})

export class AccountAddComponent {
    readonly states = LoadStates;
    currentStates = new Set();
    response: DefaultResponse;
    form = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password2: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            (control: FormControl) => {
                const group: FormGroup = this.form;
                if (group) {
                    return (group.value.password === control.value) ? null : {
                        notSame: true
                    };
                }
                return null;
            }
        ]),
        publicName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    constructor(
        private accountsService: AccountsService,
        private router: Router,
    ) { }


    create(): void {
        this.currentStates.add(this.states.wait);
        const subscribe: Subscription = this.accountsService
            .addFormCommit(this.form.value)
            .subscribe(
                (response) => {
                    if (response.status === OperationStatus.OK) {
                        this.router.navigate(['/dispatcher', 'accounts']);
                    }
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.wait);
                    subscribe.unsubscribe();
                }
            );
    }
}