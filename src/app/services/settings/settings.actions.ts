import { createAction, props } from '@ngrx/store';
import { Settings, SettingsLanguage } from './Settings';

function named(name: string) { return `[Settings] ${name}`; }

export const getAll = createAction(named('Get All'));
export const getAllSuccess = createAction(named('Get All Success'), props < { payload: Settings } > ());

export const setDarkTheme = createAction(named('Set Dark Theme'));
export const setLightTheme = createAction(named('Set Light Theme'));

export const toggleLanguage = createAction(named('Toggle Language'), props < { language: SettingsLanguage } > ());

export const showSideNav = createAction(named('Show Side Nav'));
export const hideSideNav = createAction(named('Hide Side Nav'));

export const toggleSideNav = createAction(named('Toggle Side Nav'));

export const updated = createAction(named('Updated'));