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