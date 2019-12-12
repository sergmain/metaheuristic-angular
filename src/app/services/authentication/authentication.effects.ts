import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mergeMap, merge, concatMap, withLatestFrom } from 'rxjs/operators';
import { initional, initionalComplete, logout, logoutComplete, login, loginComplete } from './authentication.action';
import { AuthenticationService } from './authentication.service';
import { of } from 'rxjs';

@Injectable()
export class AuthenticationEffects {
    constructor(
        private actions: Actions,
        private authenticationService: AuthenticationService,
        private store: Store < any >
    ) {}

    initional = createEffect(() => this.actions.pipe(
        ofType(initional),
        mergeMap(state => {
            return this.authenticationService
                .getData()
                .pipe(map(state => ({ type: initionalComplete.type, payload: state })));
        })
    ));

    logout = createEffect(() => this.actions.pipe(
        ofType(logout),
        mergeMap(state => {
            return this.authenticationService
                .logout()
                .pipe(map(state => ({ type: logoutComplete.type })));
        })
    ));

    login = createEffect(() => this.actions.pipe(
        ofType(login),

        concatMap(action => of (action).pipe(
            withLatestFrom(this.store.pipe(select(state => state)))
        )),

        mergeMap(([action, state]) => {
            return this.authenticationService
                .login(action.username, action.password)
                .pipe(map(state => ({ type: loginComplete.type, payload: state })));
        })
    ));

}