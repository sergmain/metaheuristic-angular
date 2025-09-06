import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import {SimpleAuth} from "@services/auth/SimpleAuth";
import {AuthService} from "@services/auth/auth.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MIN_PROMPT_LEN} from '@app/modules/mh-consts';

@Component({
    selector: 'auth-edit',
    templateUrl: './auth-edit.component.html',
    styleUrls: ['./auth-edit.component.scss'],
    standalone: false
})

export class AuthEditComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    response;
    auth: SimpleAuth;
    authId: string;

    form = new FormGroup({
        params: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private location: Location
    ) { }

    ngOnInit() {
        this.authId = this.route.snapshot.paramMap.get('authId');
        this.currentStates.add(this.states.firstLoading);
        this.getApi();
    }

    getApi(): void {
        this.authService
            .getAuth(this.authId)
            .subscribe(
                (response) => {
                    this.auth = response.auth;
                    this.form = new FormGroup({
                        params: new FormControl(this.auth.params, [Validators.required, Validators.minLength(5)]),
                    });

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
            .editFormCommit(this.authId, this.form.value.params)
            .subscribe(
                (response) => {
                    this.router.navigate(['/mhbp', 'auth']);
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.wait);
                }
            );
    }
}