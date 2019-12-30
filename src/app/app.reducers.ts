import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { IPlansState } from './services/plans/IPlansState';
import { plansReducer } from './services/plans/plans.reducer';
import { Settings } from './services/settings/Settings';
import { settingsReducer } from './services/settings/settings.reducer';
import { environment } from '@src/environments/environment';
import { authenticationReducer } from '@src/app/services/authentication/authentication.reducer';
import { User } from './services/authentication';
import { BatchesState } from './services/batch/BatchesState';
import { batchReducer } from './services/batch/batch.reducer';

export interface IAppState {
    settings: Settings;
    plans: IPlansState;
    user: User;
    batches: BatchesState;
}

export const appReducers: ActionReducerMap < IAppState > = {
    settings: settingsReducer,
    plans: plansReducer,
    user: authenticationReducer,
    batches: batchReducer
};

export function debug(reducer: ActionReducer < any > ): ActionReducer < any > {
    return function(state, action) {

        if (environment.production) {} else {
            console.groupCollapsed(action.type);
            console.log(action);
            console.log(state);
            console.groupEnd();
        }
        return reducer(state, action);
    };
}

export const appMetaReducers: MetaReducer < any > [] = [debug];