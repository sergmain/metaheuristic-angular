import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { getAll, getAllSuccess, setDarkTheme, setLightTheme, toggleLanguage, toggleSideNav, updated } from './settings.actions';
import { SettingsService } from './settings.service';

@Injectable()
export class SettingsEffects {
    constructor(
        private actions: Actions,
        private settingsService: SettingsService,
        private store: Store < any >
    ) {}

    updated = createEffect(() => this.actions.pipe(
        ofType(
            setDarkTheme,
            setLightTheme,
            toggleLanguage,
            toggleSideNav,
        ),

        concatMap(action => of (action).pipe(
            withLatestFrom(this.store.pipe(select(state => state)))
        )),

        mergeMap(([action, state]) => {
            return this.settingsService
                .update(state.settings)
                .pipe(map(state => ({ type: updated.type })));
        })
    ));

    getAll = createEffect(() => this.actions.pipe(
        ofType(getAll),

        mergeMap(() => {
            return this.settingsService
                .getAll()
                .pipe(map(state => ({ type: getAllSuccess.type, payload: state })));
        })
    ));
}