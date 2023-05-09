import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import {SimpleAuth} from "@services/auth/SimpleAuth";
import {AuthService} from "@services/auth/auth.service";

@Component({
    selector: 'auth-edit',
    templateUrl: './auth-edit.component.html',
    styleUrls: ['./auth-edit.component.scss']
})

export class AuthEditComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    response;
    auth: SimpleAuth;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private location: Location
    ) { }

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.getApi();
    }

    getApi(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.authService
            .getAuth(id)
            .subscribe(
                (response) => {
                    this.auth = response.auth;
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
        this.authService
            .editFormCommit(this.auth.id.toString(), this.auth.params)
            .subscribe(
                (response) => {
                    this.router.navigate(['/dispatcher', 'auths']);
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.wait);
                }
            );
    }
}