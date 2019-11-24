import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { Settings } from './services/settings/Settings';
import { settingsReducer } from './services/settings/settings.reducer';

export interface IAppState {
    settings: Settings;
}

export const reducers: ActionReducerMap < IAppState > = {
    settings: settingsReducer,
};
