import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import * as settingsAction from './settings.actions';
import { SettingsService } from './settings.service';

@Injectable()
export class SettingsEffects {
    constructor(
        private actions: Actions,
        private settingsService: SettingsService,
        private store: Store < any >
    ) {}

    updated = createEffect(() =>
        this.actions.pipe(
            ofType(
                settingsAction.setDarkTheme,
                settingsAction.setLightTheme,
                settingsAction.toggleLanguage,
                settingsAction.toggleSideNav,
            ),

            concatMap(action => of (action).pipe(
                withLatestFrom(this.store.pipe(select((state) => state)))
            )),

            mergeMap(([action, state]) => {
                return this.settingsService.update(state.settings).pipe(
                    map(state => ({ type: settingsAction.updated.type })),
                );
            })
        )
    );

    getAll = createEffect(() =>
        this.actions.pipe(
            ofType(
                settingsAction.getAll,
            ),

            mergeMap(() => {
                return this.settingsService.getAll().pipe(
                    map(state => ({ type: settingsAction.getAllSuccess.type, payload: state })),
                );
            })
        )
    );

}