import { environment } from "@src/environments/environment";

export enum SettingsTheme {
    Dark = 'dark',
        Light = 'light'
}

export enum SettingsLanguage {
    RU = 'RU',
        EN = 'EN'
}

export interface Settings {
    theme: SettingsTheme;
    sidenav: boolean;
    sidenavButton: boolean;
    language: SettingsLanguage;
}

export const setOfLanguages: Set < SettingsLanguage > = new Set([
    SettingsLanguage.EN,
    SettingsLanguage.RU,
]);

export const defaultSettings:Settings = {
    theme: SettingsTheme.Light,
    sidenav: true,
    sidenavButton: true,
    language: setOfLanguages.has(environment.language as SettingsLanguage) ?
    (environment.language as SettingsLanguage) : SettingsLanguage.EN
}