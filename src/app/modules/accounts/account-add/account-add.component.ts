import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { DefaultResponse } from '@app/models/DefaultResponse';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { OperationStatus } from '@src/app/enums/OperationStatus';
import { Subscription } from 'rxjs';

@Component({
    selector: 'account-add',
    templateUrl: './account-add.component.html',
    styleUrls: ['./account-add.component.scss']
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