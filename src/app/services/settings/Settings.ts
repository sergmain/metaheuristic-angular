export enum SettingsTheme {
    Dark = 'dark',
        Light = 'light'
}

export enum SettingsSidenav {
    Disable = 'disable',
        Enable = 'enable'
}
export enum SettingsSidenavState {
    Open = 'open',
        Hide = 'hide'
}
export enum SettingsLanguage {
    RU = 'RU',
        EN = 'EN'
}

export interface Settings {
    theme: SettingsTheme;
    sidenav: SettingsSidenav;
    sidenavState: SettingsSidenavState;
    language: SettingsLanguage;
}