import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as settingsActions from '@src/app/services/settings/settings.actions';
import { of } from 'rxjs';
import { concatMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { initional, initionalComplete, login, loginComplete, logout, logoutComplete } from './authentication.actions';
import { AuthenticationService } from './authentication.service';


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

    loginComplete = createEffect(() => this.actions.pipe(
        ofType(loginComplete),
        map(state => ({ type: settingsActions.getAll.type }))
    ));
}