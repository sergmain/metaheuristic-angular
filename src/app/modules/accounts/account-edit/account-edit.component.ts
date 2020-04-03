import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { LoadStates } from '@app/enums/LoadStates';
import { Account } from '@src/app/services/accounts/Account'
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'account-edit',
    templateUrl: './account-edit.component.html',
    styleUrls: ['./account-edit.component.scss']
})

export class AccountEditComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    response;
    account: Account;

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
        this.accountsService.account.get(id)
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
        this.accountsService.account
            .editCommit(this.account.id.toString(), this.account.publicName, this.account.enabled)
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