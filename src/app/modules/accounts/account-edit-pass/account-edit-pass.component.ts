import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { LoadStates } from '@app/enums/LoadStates';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SimpleAccount } from '@src/app/services/accounts';

@Component({
    selector: 'account-edit-pass',
    templateUrl: './account-edit-pass.component.html',
    styleUrls: ['./account-edit-pass.component.scss'],
    standalone: false
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