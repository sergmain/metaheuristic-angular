import { Action, createReducer, on } from '@ngrx/store';
import { defaultSettings, Settings, SettingsTheme } from './Settings';
import * as actions from './settings.actions';
import { state } from '@src/app/helpers/state';


export const initialState: Settings = defaultSettings;

const reducer = createReducer(
    initialState,
    on(actions.getAll, (state: Settings) => ({ ...state })),
    on(actions.getAllSuccess, (state: Settings, { payload }) => ({ ...state, ...payload })),

    on(actions.updated, (state: Settings) => ({ ...state })),

    on(actions.setDarkTheme, (state: Settings) => ({ ...state, theme: SettingsTheme.Dark })),
    on(actions.setLightTheme, (state: Settings) => ({ ...state, theme: SettingsTheme.Light })),

    on(actions.toggleLanguage, (state: Settings, { language }) => ({ ...state, language })),

    on(actions.toggleSideNav, (state: Settings) => ({ ...state, sidenav: !state.sidenav })),

    on(actions.setDefault, () => ({ ...initialState }))

);


export function settingsReducer(state: Settings | undefined, action: Action) {
    return reducer(state, action);
}