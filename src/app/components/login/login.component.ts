import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@src/app/app.reducers';
import * as authenticationAction from '@src/app/services/authentication/authentication.actions';
@Component({
    selector: 'login-view',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    username: string = '';
    password: string = '';

    form = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(1)]),
        password: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

    constructor(
        private authenticationService: AuthenticationService,
        private store: Store < AppState >
    ) {}

    login() {
        if (this.form.valid) {
            this.store.dispatch(authenticationAction.login({
                username: this.form.value.username,
                password: this.form.value.password
            }));
        }
    }
}