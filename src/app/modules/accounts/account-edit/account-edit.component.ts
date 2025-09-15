import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { LoadStates } from '@app/enums/LoadStates';
import { SimpleAccount } from '@app/services/accounts';

@Component({
    selector: 'account-edit',
    templateUrl: './account-edit.component.html',
    styleUrls: ['./account-edit.component.scss'],
    standalone: false
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